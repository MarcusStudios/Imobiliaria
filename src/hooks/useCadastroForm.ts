// src/hooks/useCadastroForm.ts
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { IMOVEIS_QUERY_KEY } from './useImoveis';
import { uploadMultipleImages } from '../services/cloudinaryService';
import type { Imovel } from '../types';

interface UseCadastroFormProps<T> {
  id?: string;
  initialData: T;
  collectionName: string;
  validateFn: (data: T, images: { previewUrls: string[], selectedFiles: File[] }) => string[];
  beforeSave?: (data: T) => any;
  successPath?: string;
}

export function useCadastroForm<T extends Partial<Imovel>>({
  id,
  initialData,
  collectionName,
  validateFn,
  beforeSave,
  successPath = '/admin'
}: UseCadastroFormProps<T>) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<T>(initialData);

  // Carregar dados existentes
  useEffect(() => {
    if (id) {
      const carregarDados = async () => {
        setLoading(true);
        try {
          const docSnap = await getDoc(doc(db, collectionName, id));
          if (docSnap.exists()) {
            const data = docSnap.data() as T;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: idIgnorado, ...dadosSemId } = data as any;
            setFormData({ ...initialData, ...dadosSemId });
            setPreviewUrls((dadosSemId.imagens as string[]) || []);
          } else {
            showToast('Registro não encontrado!', 'error');
            navigate(successPath);
          }
        } catch (error) {
          console.error("Erro ao buscar:", error);
          showToast('Erro ao carregar dados', 'error');
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, showToast, collectionName, successPath]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['preco', 'precoAluguel', 'area', 'quartos', 'banheiros', 'suites', 'vagas', 'condominio', 'iptu', 'lat', 'lng'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Validação: máximo 10 fotos
    const totalFotos = previewUrls.length + filesArray.length;
    if (totalFotos > 10) {
      showToast(`Máximo 10 fotos. Atualmente há ${previewUrls.length} foto(s).`, 'warning');
      return;
    }

    // Validação: tamanho máximo 5MB por foto
    const arquivosGrandes = filesArray.filter(f => f.size > 5 * 1024 * 1024);
    if (arquivosGrandes.length > 0) {
      showToast('Algumas imagens são muito grandes (máx 5MB).', 'warning');
      return;
    }

    setSelectedFiles(prev => [...prev, ...filesArray]);

    // Criar previews locais
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    if (id) {
      setFormData(prev => {
        const imagensAtuais = prev.imagens || [];
        return {
          ...prev,
          imagens: imagensAtuais.filter((_: string, i: number) => i !== index)
        };
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateFn(formData, { previewUrls, selectedFiles });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);

    setLoading(true);
    
    try {
      let imagensUrls = [...(formData.imagens || [])];

      // Fazer upload das novas imagens selecionadas
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        setUploadProgress(0);
        
        // Simular progresso
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const novasUrls = await uploadMultipleImages(selectedFiles);
        imagensUrls = [...imagensUrls, ...novasUrls];
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadingImages(false);
      }

      let dadosFinais = { 
        ...formData,
        imagens: imagensUrls,
      };
      
      if (dadosFinais.tipo !== 'Ambos' && 'precoAluguel' in dadosFinais) {
        dadosFinais.precoAluguel = 0;
      }

      if (beforeSave) {
        dadosFinais = beforeSave(dadosFinais);
      }

      if (id) {
        await updateDoc(doc(db, collectionName, id), {
          ...dadosFinais,
          atualizadoEm: serverTimestamp(),
        });
        // Invalida o cache
        queryClient.invalidateQueries({ queryKey: ['imovel', id] });
        queryClient.invalidateQueries({ queryKey: IMOVEIS_QUERY_KEY });
        showToast("✅ Atualizado com sucesso!", 'success');
      } else {
        await addDoc(collection(db, collectionName), {
          ...dadosFinais,
          criadoEm: serverTimestamp(),
        });
        // Invalida o cache da lista
        queryClient.invalidateQueries({ queryKey: IMOVEIS_QUERY_KEY });
        showToast("✅ Cadastrado com sucesso!", 'success');
      }
      navigate(successPath);
    } catch (error) { 
      console.error("Erro ao salvar:", error);
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      showToast("Erro ao salvar: " + msg, 'error');
    } finally {
      setLoading(false);
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  const fillWithOverride = (overrideData: Partial<T>, overridePreviewUrls: string[]) => {
    setFormData({ ...initialData, ...overrideData });
    setPreviewUrls(overridePreviewUrls);
    setSelectedFiles([]);
    setErrors([]);
  };

  return {
    formData,
    loading,
    uploadingImages,
    uploadProgress,
    previewUrls,
    selectedFiles,
    errors,
    handleChange,
    handleCheck,
    handleImageSelect,
    removeImage,
    handleSubmit,
    fillWithOverride
  };
}
