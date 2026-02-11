// src/pages/CadastroImovel.tsx - VERSÃO MELHORADA
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { Imovel } from '../types';
import { uploadMultipleImages, optimizeCloudinaryUrl } from '../services/cloudinaryService';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/CadastroImovel.css';

export const CadastroImovel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<Omit<Imovel, 'id'>>({
    titulo: '', descricao: '', tipo: 'Venda',
    preco: 0, precoAluguel: 0,
    endereco: '', bairro: '', cidade: 'Açailândia',
    area: 0, quartos: 0, suites: 0, banheiros: 0, vagas: 0,
    condominio: 0, iptu: 0,
    piscina: false, churrasqueira: false, elevador: false,
    mobiliado: false, portaria: false, aceitaPet: false,
    imagens: [], 
    lat: -15.5518, lng: -54.2980,
    ativo: true,
    destaque: false
  });

  useEffect(() => {
    if (id) {
      const carregarDados = async () => {
        setLoading(true);
        try {
          const docSnap = await getDoc(doc(db, "imoveis", id));
          if (docSnap.exists()) {
            const data = docSnap.data() as Imovel;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: idIgnorado, ...dadosSemId } = data;
            setFormData(dadosSemId);
            setPreviewUrls(dadosSemId.imagens || []);
          } else {
            alert("Imóvel não encontrado!");
            navigate('/admin');
          }
        } catch (error) {
          console.error("Erro ao buscar:", error);
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [id, navigate]);

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
      alert(`Você pode adicionar no máximo 10 fotos. Atualmente há ${previewUrls.length} foto(s).`);
      return;
    }

    // Validação: tamanho máximo 5MB por foto
    const arquivosGrandes = filesArray.filter(f => f.size > 5 * 1024 * 1024);
    if (arquivosGrandes.length > 0) {
      alert('Algumas imagens são muito grandes (máx 5MB). Por favor, comprima-as antes de fazer upload.');
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
      setFormData(prev => ({
        ...prev,
        imagens: prev.imagens.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.titulo.trim()) newErrors.push('Título é obrigatório');
    if (formData.preco <= 0) newErrors.push('Preço deve ser maior que zero');
    if (formData.tipo === 'Ambos' && (!formData.precoAluguel || formData.precoAluguel <= 0)) {
      newErrors.push('Preço de aluguel é obrigatório quando o tipo é "Ambos"');
    }
    if (!formData.endereco.trim()) newErrors.push('Endereço é obrigatório');
    if (!formData.bairro.trim()) newErrors.push('Bairro é obrigatório');
    if (previewUrls.length === 0 && selectedFiles.length === 0) {
      newErrors.push('Adicione pelo menos uma foto do imóvel');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    
    try {
      let imagensUrls = [...formData.imagens];

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

      const dadosFinais = { 
        ...formData,
        imagens: imagensUrls,
      };
      
      if (dadosFinais.tipo !== 'Ambos') dadosFinais.precoAluguel = 0;

      if (id) {
        await updateDoc(doc(db, "imoveis", id), {
          ...dadosFinais,
          atualizadoEm: serverTimestamp(),
        });
        alert("✅ Imóvel atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "imoveis"), {
          ...dadosFinais,
          criadoEm: serverTimestamp(),
        });
        alert("✅ Imóvel cadastrado com sucesso!");
      }
      navigate('/admin');
    } catch (error) { 
      console.error("Erro ao salvar:", error);
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      alert("❌ Erro ao salvar: " + msg);
    } finally {
      setLoading(false);
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        
        {/* Header */}
        <div className="cadastro-header">
          <Link to="/admin" className="back-link">
            <ArrowLeft size={18} /> Voltar ao painel
          </Link>
          
          <h1 className="page-title">
            {id ? "✏️ Editar Imóvel" : "🏠 Cadastrar Novo Imóvel"}
          </h1>
          <p className="page-subtitle">
            {id ? "Atualize as informações do imóvel" : "Preencha os dados do novo imóvel"}
          </p>
        </div>

        {/* Alertas de Erro */}
        {errors.length > 0 && (
          <div className="error-alert">
            <div className="error-header">
              <AlertCircle size={20} color="#ef4444" />
              <strong className="error-title">Corrija os seguintes erros:</strong>
            </div>
            <ul className="error-list">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Seção: Informações Principais */}
          <div className="form-section">
            <h3 className="section-title">
              📋 Informações Principais
            </h3>
            
            <div className="grid-gap-1-5">
              <div>
                <label className="form-label">
                  Título do Anúncio *
                </label>
                <input 
                  name="titulo" 
                  value={formData.titulo} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                  placeholder="Ex: Apartamento Moderno no Centro com Vista" 
                />
              </div>

              <div className="grid-cols-adaptive">
                <div>
                  <label className="form-label">
                    Finalidade *
                  </label>
                  <select 
                    name="tipo" 
                    value={formData.tipo} 
                    onChange={handleChange} 
                    className="form-select"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Venda ou Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    {formData.tipo === 'Aluguel' ? 'Valor do Aluguel (R$) *' : 'Valor de Venda (R$) *'}
                  </label>
                  <input 
                    name="preco" 
                    type="number" 
                    value={formData.preco || ''} 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                    placeholder="350000"
                  />
                </div>

                {formData.tipo === 'Ambos' && (
                  <div>
                    <label className="form-label">
                      Valor do Aluguel (R$) *
                    </label>
                    <input 
                      name="precoAluguel" 
                      type="number" 
                      value={formData.precoAluguel || ''} 
                      onChange={handleChange} 
                      className="form-input" 
                      required 
                      placeholder="2500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção: Localização */}
          <div className="form-section">
            <h3 className="section-title">
              📍 Localização
            </h3>
            
            <div className="grid-gap-1-5">
              <div>
                <label className="form-label">
                  Endereço Completo *
                </label>
                <input 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                  placeholder="Ex: Rua das Palmeiras, 123"
                />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label className="form-label">
                    Bairro *
                  </label>
                  <input 
                    name="bairro" 
                    value={formData.bairro} 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                    placeholder="Ex: Jardim Imperial"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Cidade
                  </label>
                  <input 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleChange} 
                    className="form-input" 
                    placeholder="Açailândia"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Características */}
          <div className="form-section">
            <h3 className="section-title">
              🏡 Características do Imóvel
            </h3>
            
            <div className="grid-cols-small">
              <div>
                <label className="form-label">
                  Área (m²)
                </label>
                <input 
                  name="area" 
                  type="number" 
                  value={formData.area || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="120"
                />
              </div>
              <div>
                <label className="form-label">
                  Quartos
                </label>
                <input 
                  name="quartos" 
                  type="number" 
                  value={formData.quartos || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="3"
                />
              </div>
              <div>
                <label className="form-label">
                  Suítes
                </label>
                <input 
                  name="suites" 
                  type="number" 
                  value={formData.suites || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="1"
                />
              </div>
              <div>
                <label className="form-label">
                  Banheiros
                </label>
                <input 
                  name="banheiros" 
                  type="number" 
                  value={formData.banheiros || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="2"
                />
              </div>
              <div>
                <label className="form-label">
                  Vagas
                </label>
                <input 
                  name="vagas" 
                  type="number" 
                  value={formData.vagas || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          {/* Seção: Custos Extras */}
          <div className="form-section">
            <h3 className="section-title">
              💰 Custos Adicionais
            </h3>
            
            <div className="grid-cols-2">
              <div>
                <label className="form-label">
                  Condomínio (R$/mês)
                </label>
                <input 
                  name="condominio" 
                  type="number" 
                  value={formData.condominio || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="450"
                />
              </div>
              <div>
                <label className="form-label">
                  IPTU (R$/ano)
                </label>
                <input 
                  name="iptu" 
                  type="number" 
                  value={formData.iptu || ''} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="1200"
                />
              </div>
            </div>
          </div>

          {/* Seção: Comodidades */}
          <div className="form-section">
            <h3 className="section-title">
              ✨ Comodidades
            </h3>
            
            <div className="comodidades-grid">
              {[
                { name: 'piscina', label: '🏊 Piscina' },
                { name: 'churrasqueira', label: '🔥 Churrasqueira' },
                { name: 'elevador', label: '🛗 Elevador' },
                { name: 'mobiliado', label: '🛋️ Mobiliado' },
                { name: 'portaria', label: '🚪 Portaria 24h' },
                { name: 'aceitaPet', label: '🐕 Aceita Pet' }
              ].map(comodidade => (
                <label 
                  key={comodidade.name}
                  className={`comodidade-label ${formData[comodidade.name as keyof typeof formData] ? 'active' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    name={comodidade.name} 
                    checked={formData[comodidade.name as keyof typeof formData] as boolean} 
                    onChange={handleCheck} 
                    className="comodidade-checkbox"
                  />
                  <span className="comodidade-text">
                    {comodidade.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Seção: Upload de Imagens */}
          <div className="form-section">
            <h3 className="section-title">
              📸 Fotos do Imóvel *
            </h3>
            
            <div className="grid-gap-1-5">
              <div className="upload-area">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect}
                  className="file-input"
                />
                <Upload size={48} className="upload-icon" />
                <p className="upload-title">
                  Clique ou arraste fotos aqui
                </p>
                <p className="upload-hint">
                  Máximo 10 fotos • JPG, PNG ou WEBP • Máx 5MB cada
                </p>
                <p className="upload-counter">
                  {previewUrls.length}/10 fotos adicionadas
                </p>
              </div>

              {/* Barra de Progresso */}
              {uploadingImages && (
                <div className="progress-container">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="progress-text">
                    Enviando fotos... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Preview das Imagens */}
              {previewUrls.length > 0 && (
                <div className="previews-grid">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="preview-card">
                      {index === 0 && (
                        <div className="cover-badge">
                          CAPA
                        </div>
                      )}
                      <img 
                        src={url.includes('cloudinary') ? optimizeCloudinaryUrl(url, 300) : url}
                        alt={`Preview ${index + 1}`}
                        className="preview-image"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção: Descrição */}
          <div className="form-section">
            <h3 className="section-title">
              📝 Descrição Detalhada
            </h3>
            
            <textarea 
              name="descricao" 
              rows={8} 
              value={formData.descricao} 
              onChange={handleChange} 
              className="form-textarea" 
              placeholder="Descreva o imóvel em detalhes: acabamentos, localização, diferenciais, proximidade de comércios, escolas, etc."
            />
            <p className="char-counter">
              {formData.descricao.length} caracteres
            </p>
          </div>

          {/* Seção: Configurações de Publicação */}
          <div className="form-section">
            <h3 className="section-title">
              ⚙️ Configurações de Publicação
            </h3>
            
            <div className="grid-gap-1-5">
              <label className="config-label">
                <input 
                  type="checkbox" 
                  name="ativo" 
                  checked={formData.ativo} 
                  onChange={handleCheck} 
                  className="config-checkbox"
                />
                <div>
                  <strong className="config-title">
                    Publicar Imediatamente
                  </strong>
                  <small className="config-desc">
                    Desmarque para salvar como rascunho (não aparecerá no site)
                  </small>
                </div>
              </label>

              <label className={`config-label ${formData.destaque ? 'highlight' : ''}`}>
                <input 
                  type="checkbox" 
                  name="destaque" 
                  checked={formData.destaque} 
                  onChange={handleCheck} 
                  className="config-checkbox"
                />
                <div>
                  <strong className="config-title">
                    ⭐ Marcar como Destaque
                  </strong>
                  <small className="config-desc">
                    Imóvel aparecerá com badge especial e terá prioridade na listagem
                  </small>
                </div>
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            <Link
              to="/admin"
              className="btn-cancel"
            >
              Cancelar
            </Link>

            <button 
              type="submit" 
              disabled={loading || uploadingImages}
              className="btn-submit"
            >
              {uploadingImages ? (
                <>📤 Enviando imagens...</>
              ) : loading ? (
                <>💾 Salvando...</>
              ) : (
                <>
                  <Check size={20} />
                  {id ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};