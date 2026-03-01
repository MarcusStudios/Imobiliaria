import { useParams, Link } from 'react-router-dom';
import type { Imovel } from '../types';
import { useCadastroForm } from '../hooks/useCadastroForm';
import { ImageUploader } from '../components/ImageUploader';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import '../css/CadastroForm.css';

export const CadastroTerreno = () => {
  const { id } = useParams();

  const validateTerreno = (formData: Partial<Imovel>, images: { previewUrls: string[], selectedFiles: File[] }) => {
    const newErrors: string[] = [];
    if (!formData.titulo?.trim()) newErrors.push('Título é obrigatório');
    if (!formData.preco || formData.preco <= 0) newErrors.push('Preço deve ser maior que zero');
    if (formData.tipo === 'Ambos' && (!formData.precoAluguel || formData.precoAluguel <= 0)) {
      newErrors.push('Preço de aluguel é obrigatório quando o tipo é "Ambos"');
    }
    if (!formData.endereco?.trim()) newErrors.push('Endereço é obrigatório');
    if (!formData.bairro?.trim()) newErrors.push('Bairro é obrigatório');
    
    // Específico Terreno
    if (!formData.dimensoes?.trim()) newErrors.push('Dimensões do terreno são obrigatórias');
    if (!formData.area || formData.area <= 0) newErrors.push('Área total é obrigatória');

    if (images.previewUrls.length === 0 && images.selectedFiles.length === 0) {
      newErrors.push('Adicione pelo menos uma foto do terreno');
    }
    return newErrors;
  };

  const initialData: Partial<Imovel> = {
    titulo: '', descricao: '', tipo: 'Venda', categoria: 'Terreno',
    preco: 0, precoAluguel: 0, endereco: '', bairro: '', cidade: 'Açailândia',
    dimensoes: '', topografia: 'Plano', zoneamento: 'Residencial',
    area: 0, quartos: 0, suites: 0, banheiros: 0, vagas: 0,
    condominio: 0, iptu: 0, piscina: false, churrasqueira: false, 
    elevador: false, mobiliado: false, portaria: false, aceitaPet: false,
    imagens: [], lat: -15.5518, lng: -54.2980, ativo: true, destaque: false
  };

  const forceCategoria = (data: Partial<Imovel>) => ({ ...data, categoria: 'Terreno' });

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
    validateFn: validateTerreno,
    beforeSave: forceCategoria
  });

  const handleMock = () => {
    fillWithOverride({
      titulo: 'Terreno de Teste ' + Math.floor(Math.random() * 1000),
      descricao: 'Excelente terreno plano, pronto para construir. Localização privilegiada com fácil acesso e infraestrutura completa. Ótima oportunidade de investimento.',
      tipo: 'Venda', categoria: 'Terreno',
      preco: 100000 + Math.floor(Math.random() * 200000),
      precoAluguel: 0,
      endereco: 'Avenida de Teste, ' + Math.floor(Math.random() * 1000),
      bairro: 'Bairro Genérico', cidade: 'Açailândia',
      dimensoes: '12x30', topografia: 'Plano', zoneamento: 'Residencial',
      area: 360 + Math.floor(Math.random() * 100),
      quartos: 0, suites: 0, banheiros: 0, vagas: 0,
      condominio: 150, iptu: 500,
      piscina: false, churrasqueira: false, elevador: false,
      mobiliado: false, portaria: false, aceitaPet: false,
      imagens: [], lat: -15.5518, lng: -54.2980,
      ativo: true, destaque: true
    }, [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595844730298-b960fa25e985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
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
                {id ? "✏️ Editar Terreno" : "🏞️ Cadastrar Novo Terreno"}
              </h1>
              <p className="page-subtitle">
                {id ? "Atualize as informações do terreno" : "Preencha os dados do novo terreno"}
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
                <label className="form-label">Título do Anúncio *</label>
                <input name="titulo" value={formData.titulo} onChange={handleChange} className="form-input" required placeholder="Ex: Terreno Plano em Condomínio Fechado" />
              </div>

              <div className="grid-cols-adaptive">
                <div>
                  <label className="form-label">Finalidade *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select">
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Venda ou Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    {formData.tipo === 'Aluguel' ? 'Valor do Aluguel (R$) *' : 'Valor de Venda (R$) *'}
                  </label>
                  <input name="preco" type="number" value={formData.preco || ''} onChange={handleChange} className="form-input" required placeholder="150000" />
                </div>

                {formData.tipo === 'Ambos' && (
                  <div>
                    <label className="form-label">Valor do Aluguel (R$) *</label>
                    <input name="precoAluguel" type="number" value={formData.precoAluguel || ''} onChange={handleChange} className="form-input" required placeholder="1000" />
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
                <label className="form-label">Endereço Completo *</label>
                <input name="endereco" value={formData.endereco} onChange={handleChange} className="form-input" required placeholder="Ex: Rua Projetada A, s/n" />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label className="form-label">Bairro *</label>
                  <input name="bairro" value={formData.bairro} onChange={handleChange} className="form-input" required placeholder="Ex: Jardim America" />
                </div>
                <div>
                  <label className="form-label">Cidade</label>
                  <input name="cidade" value={formData.cidade} onChange={handleChange} className="form-input" placeholder="Açailândia" />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Características do Terreno */}
          <div className="form-section">
            <h3 className="section-title">🏞️ Detalhes do Terreno</h3>
            <div className="grid-cols-adaptive">
              <div>
                <label className="form-label">Área Total (m²) *</label>
                <input name="area" type="number" value={formData.area || ''} onChange={handleChange} className="form-input" required placeholder="300" />
              </div>
              <div>
                <label className="form-label">Dimensões *</label>
                <input name="dimensoes" value={formData.dimensoes || ''} onChange={handleChange} className="form-input" required placeholder="Ex: 10x30" />
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginTop: '1rem' }}>
              <div>
                <label className="form-label">Topografia</label>
                <select name="topografia" value={formData.topografia} onChange={handleChange} className="form-select">
                  <option value="Plano">Plano</option>
                  <option value="Aclive">Aclive</option>
                  <option value="Declive">Declive</option>
                </select>
              </div>
              <div>
                <label className="form-label">Zoneamento</label>
                <select name="zoneamento" value={formData.zoneamento} onChange={handleChange} className="form-select">
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Misto">Misto</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção: Custos Extras */}
          <div className="form-section">
            <h3 className="section-title">💰 Custos Adicionais</h3>
            <div className="grid-cols-2">
              <div>
                <label className="form-label">Condomínio (R$/mês)</label>
                <input name="condominio" type="number" value={formData.condominio || ''} onChange={handleChange} className="form-input" placeholder="0" />
              </div>
              <div>
                <label className="form-label">IPTU (R$/ano)</label>
                <input name="iptu" type="number" value={formData.iptu || ''} onChange={handleChange} className="form-input" placeholder="500" />
              </div>
            </div>
          </div>

          {/* Seção: Upload de Imagens */}
          <div className="form-section">
            <h3 className="section-title">📸 Fotos do Terreno *</h3>
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
            <textarea name="descricao" rows={8} value={formData.descricao} onChange={handleChange} className="form-input" placeholder="Descreva o terreno em detalhes..." />
            <p className="char-counter">{formData.descricao?.length || 0} caracteres</p>
          </div>

          {/* Seção: Configurações de Publicação */}
          <div className="form-section">
            <h3 className="section-title">⚙️ Configurações de Publicação</h3>
            <div className="grid-gap-1-5">
              <label className="config-label">
                <input type="checkbox" name="ativo" checked={formData.ativo || false} onChange={handleCheck} className="config-checkbox" />
                <div>
                  <strong className="config-title">Publicar Imediatamente</strong>
                  <small className="config-desc">Desmarque para salvar como rascunho (não aparecerá no site)</small>
                </div>
              </label>

              <label className={`config-label ${formData.destaque ? 'highlight' : ''}`}>
                <input type="checkbox" name="destaque" checked={formData.destaque || false} onChange={handleCheck} className="config-checkbox" />
                <div>
                  <strong className="config-title">⭐ Marcar como Destaque</strong>
                  <small className="config-desc">Terreno aparecerá com badge especial e terá prioridade na listagem</small>
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
                  {id ? 'Atualizar Terreno' : 'Cadastrar Terreno'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
