// src/pages/CadastroImovel.tsx
import { useParams } from 'react-router-dom';
import type { Imovel } from '../types';
import { useCadastroForm } from '../hooks/useCadastroForm';
import { ImageUploader } from '../components/ImageUploader';
import {
  FormHeader,
  FormErrorAlert,
  FormInfoSection,
  FormLocationSection,
  FormCostsSection,
  FormDescriptionSection,
  FormPublishSection,
  FormActions,
} from '../components/form';
import '../css/CadastroForm.css';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
];

const validateImovel = (
  formData: Partial<Imovel>,
  images: { previewUrls: string[]; selectedFiles: File[] }
): string[] => {
  const errors: string[] = [];
  if (!formData.titulo?.trim()) errors.push('Título é obrigatório');
  if (!formData.preco || formData.preco <= 0) errors.push('Preço deve ser maior que zero');
  if (formData.tipo === 'Ambos' && (!formData.precoAluguel || formData.precoAluguel <= 0)) {
    errors.push('Preço de aluguel é obrigatório quando o tipo é "Ambos"');
  }
  if (!formData.endereco?.trim()) errors.push('Endereço é obrigatório');
  if (!formData.bairro?.trim()) errors.push('Bairro é obrigatório');
  if (images.previewUrls.length === 0 && images.selectedFiles.length === 0) {
    errors.push('Adicione pelo menos uma foto do imóvel');
  }
  return errors;
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
  ativo: true, destaque: false,
};

export const CadastroImovel = () => {
  const { id } = useParams();

  const {
    formData, loading, uploadingImages, uploadProgress,
    previewUrls, errors,
    handleChange, handleCheck, handleImageSelect, removeImage,
    handleSubmit, fillWithOverride,
  } = useCadastroForm<Partial<Imovel>>({
    id,
    initialData,
    collectionName: 'imoveis',
    validateFn: validateImovel,
  });

  const handleMock = () => fillWithOverride({
    titulo: 'Casa de Teste ' + Math.floor(Math.random() * 1000),
    descricao: 'Descrição genérica de um imóvel adorável, espaçoso e bem localizado para testes rápidos do sistema. Possui vários acabamentos modernos, excelente iluminação natural, e está pronto para morar.',
    tipo: 'Venda',
    preco: 300000 + Math.floor(Math.random() * 500000),
    precoAluguel: 0,
    endereco: 'Rua de Teste, ' + Math.floor(Math.random() * 1000),
    bairro: 'Bairro Genérico', cidade: 'Açailândia',
    area: 150 + Math.floor(Math.random() * 100),
    quartos: 3, suites: 1, banheiros: 2, vagas: 2,
    condominio: 300, iptu: 1500,
    piscina: true, churrasqueira: true, elevador: false,
    mobiliado: false, portaria: false, aceitaPet: true,
    imagens: [], lat: -15.5518, lng: -54.2980,
    ativo: true, destaque: true,
  }, MOCK_IMAGES);

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">

        <FormHeader
          id={id}
          title={id ? '✏️ Editar Imóvel' : '🏠 Cadastrar Novo Imóvel'}
          subtitle={id ? 'Atualize as informações do imóvel' : 'Preencha os dados do novo imóvel'}
          onMock={handleMock}
        />

        <FormErrorAlert errors={errors} />

        <form onSubmit={handleSubmit}>

          <FormInfoSection formData={formData} handleChange={handleChange} />

          <FormLocationSection formData={formData} handleChange={handleChange} />

          {/* Seção exclusiva: Características do Imóvel */}
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

          <FormCostsSection formData={formData} handleChange={handleChange} />

          {/* Seção exclusiva: Comodidades */}
          <div className="form-section">
            <h3 className="section-title">✨ Comodidades</h3>
            <div className="comodidades-grid">
              {[
                { name: 'piscina', label: '🏊 Piscina' },
                { name: 'churrasqueira', label: '🔥 Churrasqueira' },
                { name: 'elevador', label: '🛗 Elevador' },
                { name: 'mobiliado', label: '🛋️ Mobiliado' },
                { name: 'portaria', label: '🚪 Portaria 24h' },
                { name: 'aceitaPet', label: '🐕 Aceita Pet' },
              ].map(comodidade => (
                <label
                  key={comodidade.name}
                  className={`comodidade-label ${formData[comodidade.name as keyof Partial<Imovel>] ? 'active' : ''}`}
                  htmlFor={`comodidade-${comodidade.name}`}
                >
                  <input
                    id={`comodidade-${comodidade.name}`}
                    type="checkbox"
                    name={comodidade.name}
                    checked={formData[comodidade.name as keyof Partial<Imovel>] as boolean || false}
                    onChange={handleCheck}
                    className="comodidade-checkbox"
                  />
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

          <FormDescriptionSection
            formData={formData}
            handleChange={handleChange}
            placeholder="Descreva o imóvel em detalhes..."
          />

          <FormPublishSection
            formData={formData}
            handleCheck={handleCheck}
            entityLabel="Imóvel"
          />

          <FormActions
            id={id}
            loading={loading}
            uploadingImages={uploadingImages}
            entityLabel="Imóvel"
          />

        </form>
      </div>
    </div>
  );
};