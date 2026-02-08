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
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Link 
            to="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <ArrowLeft size={18} /> Voltar ao painel
          </Link>
          
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#1e293b' }}>
            {id ? "✏️ Editar Imóvel" : "🏠 Cadastrar Novo Imóvel"}
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            {id ? "Atualize as informações do imóvel" : "Preencha os dados do novo imóvel"}
          </p>
        </div>

        {/* Alertas de Erro */}
        {errors.length > 0 && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={20} color="#ef4444" />
              <strong style={{ color: '#991b1b' }}>Corrija os seguintes erros:</strong>
            </div>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', color: '#7f1d1d' }}>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Seção: Informações Principais */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📋 Informações Principais
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Título do Anúncio *
                </label>
                <input 
                  name="titulo" 
                  value={formData.titulo} 
                  onChange={handleChange} 
                  className="input-control" 
                  required 
                  placeholder="Ex: Apartamento Moderno no Centro com Vista" 
                  style={{ fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Finalidade *
                  </label>
                  <select 
                    name="tipo" 
                    value={formData.tipo} 
                    onChange={handleChange} 
                    className="input-control"
                    style={{ fontSize: '1rem' }}
                  >
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Venda ou Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    {formData.tipo === 'Aluguel' ? 'Valor do Aluguel (R$) *' : 'Valor de Venda (R$) *'}
                  </label>
                  <input 
                    name="preco" 
                    type="number" 
                    value={formData.preco || ''} 
                    onChange={handleChange} 
                    className="input-control" 
                    required 
                    placeholder="350000"
                    style={{ fontSize: '1rem' }}
                  />
                </div>

                {formData.tipo === 'Ambos' && (
                  <div>
                    <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Valor do Aluguel (R$) *
                    </label>
                    <input 
                      name="precoAluguel" 
                      type="number" 
                      value={formData.precoAluguel || ''} 
                      onChange={handleChange} 
                      className="input-control" 
                      required 
                      placeholder="2500"
                      style={{ fontSize: '1rem' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção: Localização */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📍 Localização
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Endereço Completo *
                </label>
                <input 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleChange} 
                  className="input-control" 
                  required 
                  placeholder="Ex: Rua das Palmeiras, 123"
                  style={{ fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Bairro *
                  </label>
                  <input 
                    name="bairro" 
                    value={formData.bairro} 
                    onChange={handleChange} 
                    className="input-control" 
                    required 
                    placeholder="Ex: Jardim Imperial"
                    style={{ fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Cidade
                  </label>
                  <input 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleChange} 
                    className="input-control" 
                    placeholder="Açailândia"
                    style={{ fontSize: '1rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Características */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              🏡 Características do Imóvel
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Área (m²)
                </label>
                <input 
                  name="area" 
                  type="number" 
                  value={formData.area || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="120"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Quartos
                </label>
                <input 
                  name="quartos" 
                  type="number" 
                  value={formData.quartos || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="3"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Suítes
                </label>
                <input 
                  name="suites" 
                  type="number" 
                  value={formData.suites || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="1"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Banheiros
                </label>
                <input 
                  name="banheiros" 
                  type="number" 
                  value={formData.banheiros || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="2"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Vagas
                </label>
                <input 
                  name="vagas" 
                  type="number" 
                  value={formData.vagas || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="2"
                  style={{ fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>

          {/* Seção: Custos Extras */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              💰 Custos Adicionais
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Condomínio (R$/mês)
                </label>
                <input 
                  name="condominio" 
                  type="number" 
                  value={formData.condominio || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="450"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  IPTU (R$/ano)
                </label>
                <input 
                  name="iptu" 
                  type="number" 
                  value={formData.iptu || ''} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="1200"
                  style={{ fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>

          {/* Seção: Comodidades */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              ✨ Comodidades
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
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
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer',
                    padding: '0.75rem',
                    background: formData[comodidade.name as keyof typeof formData] ? '#f0fdf4' : '#f8fafc',
                    border: formData[comodidade.name as keyof typeof formData] ? '2px solid #22c55e' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox" 
                    name={comodidade.name} 
                    checked={formData[comodidade.name as keyof typeof formData] as boolean} 
                    onChange={handleCheck} 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                    {comodidade.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Seção: Upload de Imagens */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📸 Fotos do Imóvel *
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: '#f8fafc',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <p style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                  Clique ou arraste fotos aqui
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                  Máximo 10 fotos • JPG, PNG ou WEBP • Máx 5MB cada
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  {previewUrls.length}/10 fotos adicionadas
                </p>
              </div>

              {/* Barra de Progresso */}
              {uploadingImages && (
                <div>
                  <div style={{ 
                    background: '#e2e8f0', 
                    height: '8px', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'var(--primary)',
                      height: '100%',
                      width: `${uploadProgress}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ 
                    margin: '0.5rem 0 0', 
                    fontSize: '0.875rem', 
                    color: '#64748b',
                    textAlign: 'center'
                  }}>
                    Enviando fotos... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Preview das Imagens */}
              {previewUrls.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                  gap: '1rem'
                }}>
                  {previewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0',
                        background: '#f8fafc'
                      }}
                    >
                      {index === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          zIndex: 2
                        }}>
                          CAPA
                        </div>
                      )}
                      <img 
                        src={url.includes('cloudinary') ? optimizeCloudinaryUrl(url, 300) : url}
                        alt={`Preview ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(239, 68, 68, 0.95)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          zIndex: 2
                        }}
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
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📝 Descrição Detalhada
            </h3>
            
            <textarea 
              name="descricao" 
              rows={8} 
              value={formData.descricao} 
              onChange={handleChange} 
              className="input-control" 
              placeholder="Descreva o imóvel em detalhes: acabamentos, localização, diferenciais, proximidade de comércios, escolas, etc."
              style={{ 
                fontSize: '1rem',
                lineHeight: 1.6,
                resize: 'vertical'
              }}
            />
            <p style={{ 
              margin: '0.5rem 0 0', 
              fontSize: '0.875rem', 
              color: '#64748b'
            }}>
              {formData.descricao.length} caracteres
            </p>
          </div>

          {/* Seção: Configurações de Publicação */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              fontSize: '1.25rem',
              color: '#1e293b',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #f1f5f9'
            }}>
              ⚙️ Configurações de Publicação
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <label style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px', 
                cursor: 'pointer',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '2px solid #e2e8f0'
              }}>
                <input 
                  type="checkbox" 
                  name="ativo" 
                  checked={formData.ativo} 
                  onChange={handleCheck} 
                  style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }} 
                />
                <div>
                  <strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                    Publicar Imediatamente
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Desmarque para salvar como rascunho (não aparecerá no site)
                  </small>
                </div>
              </label>

              <label style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px', 
                cursor: 'pointer',
                padding: '1rem',
                background: formData.destaque ? '#fef3c7' : '#f8fafc',
                borderRadius: '8px',
                border: formData.destaque ? '2px solid #fbbf24' : '2px solid #e2e8f0'
              }}>
                <input 
                  type="checkbox" 
                  name="destaque" 
                  checked={formData.destaque} 
                  onChange={handleCheck} 
                  style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }} 
                />
                <div>
                  <strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                    ⭐ Marcar como Destaque
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Imóvel aparecerá com badge especial e terá prioridade na listagem
                  </small>
                </div>
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/admin"
              style={{
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancelar
            </Link>

            <button 
              type="submit" 
              disabled={loading || uploadingImages}
              style={{
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                background: loading || uploadingImages ? '#cbd5e1' : 'var(--primary)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading || uploadingImages ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: loading || uploadingImages ? 'none' : '0 4px 6px rgba(0,0,0,0.1)'
              }}
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