// src/pages/CadastroTerreno.tsx
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
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595844730298-b960fa25e985?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
];

const validateTerreno = (
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
  if (!formData.dimensoes?.trim()) errors.push('Dimensões do terreno são obrigatórias');
  if (!formData.area || formData.area <= 0) errors.push('Área total é obrigatória');
  if (images.previewUrls.length === 0 && images.selectedFiles.length === 0) {
    errors.push('Adicione pelo menos uma foto do terreno');
  }
  return errors;
};

const initialData: Partial<Imovel> = {
  titulo: '', descricao: '', tipo: 'Venda', categoria: 'Terreno',
  preco: 0, precoAluguel: 0, endereco: '', bairro: '', cidade: 'Açailândia',
  dimensoes: '', topografia: 'Plano', zoneamento: 'Residencial',
  area: 0, quartos: 0, suites: 0, banheiros: 0, vagas: 0,
  condominio: 0, iptu: 0, piscina: false, churrasqueira: false,
  elevador: false, mobiliado: false, portaria: false, aceitaPet: false,
  imagens: [], lat: -15.5518, lng: -54.2980, ativo: true, destaque: false,
};

const forceCategoria = (data: Partial<Imovel>) => ({ ...data, categoria: 'Terreno' as const });

export const CadastroTerreno = () => {
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
    validateFn: validateTerreno,
    beforeSave: forceCategoria,
  });

  const handleMock = () => fillWithOverride({
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
    ativo: true, destaque: true,
  }, MOCK_IMAGES);

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">

        <FormHeader
          id={id}
          title={id ? '✏️ Editar Terreno' : '🏞️ Cadastrar Novo Terreno'}
          subtitle={id ? 'Atualize as informações do terreno' : 'Preencha os dados do novo terreno'}
          onMock={handleMock}
        />

        <FormErrorAlert errors={errors} />

        <form onSubmit={handleSubmit}>

          <FormInfoSection formData={formData} handleChange={handleChange} />

          <FormLocationSection formData={formData} handleChange={handleChange} />

          {/* Seção exclusiva: Detalhes do Terreno */}
          <div className="form-section">
            <h3 className="section-title">🏞️ Detalhes do Terreno</h3>
            <div className="grid-cols-adaptive">
              <div>
                <label className="form-label" htmlFor="area-terreno-input">Área Total (m²) *</label>
                <input id="area-terreno-input" name="area" type="number" value={formData.area || ''} onChange={handleChange} className="form-input" required placeholder="300" />
              </div>
              <div>
                <label className="form-label" htmlFor="dimensoes-input">Dimensões *</label>
                <input id="dimensoes-input" name="dimensoes" value={formData.dimensoes || ''} onChange={handleChange} className="form-input" required placeholder="Ex: 10x30" />
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginTop: '1rem' }}>
              <div>
                <label className="form-label" htmlFor="topografia-select">Topografia</label>
                <select id="topografia-select" name="topografia" value={formData.topografia} onChange={handleChange} className="form-select">
                  <option value="Plano">Plano</option>
                  <option value="Aclive">Aclive</option>
                  <option value="Declive">Declive</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="zoneamento-select">Zoneamento</label>
                <select id="zoneamento-select" name="zoneamento" value={formData.zoneamento} onChange={handleChange} className="form-select">
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Misto">Misto</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>
          </div>

          <FormCostsSection formData={formData} handleChange={handleChange} />

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

          <FormDescriptionSection
            formData={formData}
            handleChange={handleChange}
            placeholder="Descreva o terreno em detalhes..."
          />

          <FormPublishSection
            formData={formData}
            handleCheck={handleCheck}
            entityLabel="Terreno"
          />

          <FormActions
            id={id}
            loading={loading}
            uploadingImages={uploadingImages}
            entityLabel="Terreno"
          />

        </form>
      </div>
    </div>
  );
};
