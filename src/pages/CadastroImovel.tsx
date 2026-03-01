import { useParams, Link } from 'react-router-dom';
import type { Imovel } from '../types';
import { useCadastroForm } from '../hooks/useCadastroForm';
import { ImageUploader } from '../components/ImageUploader';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import '../css/CadastroForm.css';

export const CadastroImovel = () => {
  const { id } = useParams();

  const validateImovel = (formData: Partial<Imovel>, images: { previewUrls: string[], selectedFiles: File[] }) => {
    const newErrors: string[] = [];
    if (!formData.titulo?.trim()) newErrors.push('Título é obrigatório');
    if (!formData.preco || formData.preco <= 0) newErrors.push('Preço deve ser maior que zero');
    if (formData.tipo === 'Ambos' && (!formData.precoAluguel || formData.precoAluguel <= 0)) {
      newErrors.push('Preço de aluguel é obrigatório quando o tipo é "Ambos"');
    }
    if (!formData.endereco?.trim()) newErrors.push('Endereço é obrigatório');
    if (!formData.bairro?.trim()) newErrors.push('Bairro é obrigatório');
    if (images.previewUrls.length === 0 && images.selectedFiles.length === 0) {
      newErrors.push('Adicione pelo menos uma foto do imóvel');
    }
    return newErrors;
  };

  const initialData: Partial<Imovel> = {
    titulo: '', descricao: '', tipo: 'Venda',
    preco: 0, precoAluguel: 0,
    endereco: '', bairro: '', cidade: 'Açailândia',
    area: 0, quartos: 0, suites: 0, banheiros: 0, vagas: 0,
    condominio: 0, iptu: 0,
    piscina: false, churrasqueira: false, elevador: false,
    mobiliado: false, portaria: false, aceitaPet: false,
    imagens: [], lat: -15.5518, lng: -54.2980,
    ativo: true, destaque: false
  };

  const {
    formData,
    loading,
    uploadingImages,
    uploadProgress,
    previewUrls,
    errors,
    handleChange,
    handleCheck,
    handleImageSelect,
    removeImage,
    handleSubmit,
    fillWithOverride
  } = useCadastroForm<Partial<Imovel>>({
    id,
    initialData,
    collectionName: 'imoveis',
    validateFn: validateImovel
  });

  const handleMock = () => {
    fillWithOverride({
      titulo: 'Casa de Teste ' + Math.floor(Math.random() * 1000),
      descricao: 'Descrição genérica de um imóvel adorável, espaçoso e bem localizado para testes rápidos do sistema. Possui vários acabamentos modernos, excelente iluminação natural, e está pronto para morar.',
      tipo: 'Venda',
      preco: 300000 + Math.floor(Math.random() * 500000),
      precoAluguel: 0,
      endereco: 'Rua de Teste, ' + Math.floor(Math.random() * 1000),
      bairro: 'Bairro Genérico',
      cidade: 'Açailândia',
      area: 150 + Math.floor(Math.random() * 100),
      quartos: 3, suites: 1, banheiros: 2, vagas: 2,
      condominio: 300, iptu: 1500,
      piscina: true, churrasqueira: true, elevador: false,
      mobiliado: false, portaria: false, aceitaPet: true,
      imagens: [],
      lat: -15.5518, lng: -54.2980,
      ativo: true, destaque: true
    }, [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ]);
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        
        {/* Header */}
        <div className="cadastro-header">
          <Link to="/admin" className="back-link">
            <ArrowLeft size={18} /> Voltar ao painel
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 className="page-title">
                {id ? "✏️ Editar Imóvel" : "🏠 Cadastrar Novo Imóvel"}
              </h1>
              <p className="page-subtitle">
                {id ? "Atualize as informações do imóvel" : "Preencha os dados do novo imóvel"}
              </p>
            </div>
            
            {!id && (
              <button type="button" onClick={handleMock} className="mock-btn" style={{
                padding: '8px 16px', backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe',
                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: '8px', fontWeight: '500', color: '#4f46e5'
              }}>
                🪄 Preencher com Dados de Teste
              </button>
            )}
          </div>
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
            <h3 className="section-title">📋 Informações Principais</h3>
            <div className="grid-gap-1-5">
              <div>
                <label className="form-label" htmlFor="titulo-input">Título do Anúncio *</label>
                <input id="titulo-input" name="titulo" value={formData.titulo} onChange={handleChange} className="form-input" required placeholder="Ex: Apartamento Moderno no Centro com Vista" />
              </div>

              <div className="grid-cols-adaptive">
                <div>
                  <label className="form-label" htmlFor="tipo-select">Finalidade *</label>
                  <select id="tipo-select" name="tipo" value={formData.tipo} onChange={handleChange} className="form-select">
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Venda ou Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="preco-input">
                    {formData.tipo === 'Aluguel' ? 'Valor do Aluguel (R$) *' : 'Valor de Venda (R$) *'}
                  </label>
                  <input id="preco-input" name="preco" type="number" value={formData.preco || ''} onChange={handleChange} className="form-input" required placeholder="350000" />
                </div>

                {formData.tipo === 'Ambos' && (
                  <div>
                    <label className="form-label" htmlFor="preco-aluguel-input">Valor do Aluguel (R$) *</label>
                    <input id="preco-aluguel-input" name="precoAluguel" type="number" value={formData.precoAluguel || ''} onChange={handleChange} className="form-input" required placeholder="2500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção: Localização */}
          <div className="form-section">
            <h3 className="section-title">📍 Localização</h3>
            <div className="grid-gap-1-5">
              <div>
                <label className="form-label" htmlFor="endereco-input">Endereço Completo *</label>
                <input id="endereco-input" name="endereco" value={formData.endereco} onChange={handleChange} className="form-input" required placeholder="Ex: Rua das Palmeiras, 123" />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="bairro-input">Bairro *</label>
                  <input id="bairro-input" name="bairro" value={formData.bairro} onChange={handleChange} className="form-input" required placeholder="Ex: Jardim Imperial" />
                </div>
                <div>
                  <label className="form-label" htmlFor="cidade-input">Cidade</label>
                  <input id="cidade-input" name="cidade" value={formData.cidade} onChange={handleChange} className="form-input" placeholder="Açailândia" />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Características */}
          <div className="form-section">
            <h3 className="section-title">🏡 Características do Imóvel</h3>
            <div className="grid-cols-small">
              <div>
                <label className="form-label" htmlFor="area-input">Área (m²)</label>
                <input id="area-input" name="area" type="number" value={formData.area || ''} onChange={handleChange} className="form-input" placeholder="120" />
              </div>
              <div>
                <label className="form-label" htmlFor="quartos-input">Quartos</label>
                <input id="quartos-input" name="quartos" type="number" value={formData.quartos || ''} onChange={handleChange} className="form-input" placeholder="3" />
              </div>
              <div>
                <label className="form-label" htmlFor="suites-input">Suítes</label>
                <input id="suites-input" name="suites" type="number" value={formData.suites || ''} onChange={handleChange} className="form-input" placeholder="1" />
              </div>
              <div>
                <label className="form-label" htmlFor="banheiros-input">Banheiros</label>
                <input id="banheiros-input" name="banheiros" type="number" value={formData.banheiros || ''} onChange={handleChange} className="form-input" placeholder="2" />
              </div>
              <div>
                <label className="form-label" htmlFor="vagas-input">Vagas</label>
                <input id="vagas-input" name="vagas" type="number" value={formData.vagas || ''} onChange={handleChange} className="form-input" placeholder="2" />
              </div>
            </div>
          </div>

          {/* Seção: Custos Extras */}
          <div className="form-section">
            <h3 className="section-title">💰 Custos Adicionais</h3>
            <div className="grid-cols-2">
              <div>
                <label className="form-label" htmlFor="condominio-input">Condomínio (R$/mês)</label>
                <input id="condominio-input" name="condominio" type="number" value={formData.condominio || ''} onChange={handleChange} className="form-input" placeholder="450" />
              </div>
              <div>
                <label className="form-label" htmlFor="iptu-input">IPTU (R$/ano)</label>
                <input id="iptu-input" name="iptu" type="number" value={formData.iptu || ''} onChange={handleChange} className="form-input" placeholder="1200" />
              </div>
            </div>
          </div>

          {/* Seção: Comodidades */}
          <div className="form-section">
            <h3 className="section-title">✨ Comodidades</h3>
            <div className="comodidades-grid">
              {[
                { name: 'piscina', label: '🏊 Piscina' },
                { name: 'churrasqueira', label: '🔥 Churrasqueira' },
                { name: 'elevador', label: '🛗 Elevador' },
                { name: 'mobiliado', label: '🛋️ Mobiliado' },
                { name: 'portaria', label: '🚪 Portaria 24h' },
                { name: 'aceitaPet', label: '🐕 Aceita Pet' }
              ].map(comodidade => (
                <label key={comodidade.name} className={`comodidade-label ${formData[comodidade.name as keyof Partial<Imovel>] ? 'active' : ''}`} htmlFor={`comodidade-${comodidade.name}`}>
                  <input id={`comodidade-${comodidade.name}`} type="checkbox" name={comodidade.name} checked={formData[comodidade.name as keyof Partial<Imovel>] as boolean || false} onChange={handleCheck} className="comodidade-checkbox" />
                  <span className="comodidade-text">{comodidade.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seção: Upload de Imagens */}
          <div className="form-section">
            <h3 className="section-title">📸 Fotos do Imóvel *</h3>
            <ImageUploader
              previewUrls={previewUrls}
              uploadingImages={uploadingImages}
              uploadProgress={uploadProgress}
              onImageSelect={handleImageSelect}
              onRemoveImage={removeImage}
            />
          </div>

          {/* Seção: Descrição */}
          <div className="form-section">
            <h3 className="section-title">📝 Descrição Detalhada</h3>
            <label htmlFor="descricao-textarea" className="sr-only" aria-hidden="true" style={{ display: 'none' }}>Descrição</label>
            <textarea id="descricao-textarea" name="descricao" rows={8} value={formData.descricao} onChange={handleChange} className="form-input" placeholder="Descreva o imóvel em detalhes..." />
            <p className="char-counter">{formData.descricao?.length || 0} caracteres</p>
          </div>

          {/* Seção: Configurações de Publicação */}
          <div className="form-section">
            <h3 className="section-title">⚙️ Configurações de Publicação</h3>
            <div className="grid-gap-1-5">
              <label className="config-label" htmlFor="ativo-checkbox">
                <input id="ativo-checkbox" type="checkbox" name="ativo" checked={formData.ativo || false} onChange={handleCheck} className="config-checkbox" />
                <div>
                  <strong className="config-title">Publicar Imediatamente</strong>
                  <small className="config-desc">Desmarque para salvar como rascunho (não aparecerá no site)</small>
                </div>
              </label>

              <label className={`config-label ${formData.destaque ? 'highlight' : ''}`} htmlFor="destaque-checkbox">
                <input id="destaque-checkbox" type="checkbox" name="destaque" checked={formData.destaque || false} onChange={handleCheck} className="config-checkbox" />
                <div>
                  <strong className="config-title">⭐ Marcar como Destaque</strong>
                  <small className="config-desc">Imóvel aparecerá com badge especial e terá prioridade na listagem</small>
                </div>
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            <Link to="/admin" className="btn-cancel">Cancelar</Link>
            <button type="submit" disabled={loading || uploadingImages} className="btn-submit">
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