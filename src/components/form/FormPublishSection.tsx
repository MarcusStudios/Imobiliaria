// src/components/form/FormPublishSection.tsx
import type { ChangeEvent } from 'react';
import type { Imovel } from '../../types';

interface FormPublishSectionProps {
  formData: Partial<Imovel>;
  handleCheck: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Label used in the destaque description, e.g. "Imóvel" or "Terreno" */
  entityLabel?: string;
}

export const FormPublishSection = ({
  formData,
  handleCheck,
  entityLabel = 'Item',
}: FormPublishSectionProps) => (
  <div className="form-section">
    <h3 className="section-title">⚙️ Configurações de Publicação</h3>
    <div className="grid-gap-1-5">
      <label className="config-label" htmlFor="ativo-checkbox">
        <input
          id="ativo-checkbox"
          type="checkbox"
          name="ativo"
          checked={formData.ativo || false}
          onChange={handleCheck}
          className="config-checkbox"
        />
        <div>
          <strong className="config-title">Publicar Imediatamente</strong>
          <small className="config-desc">Desmarque para salvar como rascunho (não aparecerá no site)</small>
        </div>
      </label>

      <label className={`config-label ${formData.destaque ? 'highlight' : ''}`} htmlFor="destaque-checkbox">
        <input
          id="destaque-checkbox"
          type="checkbox"
          name="destaque"
          checked={formData.destaque || false}
          onChange={handleCheck}
          className="config-checkbox"
        />
        <div>
          <strong className="config-title">⭐ Marcar como Destaque</strong>
          <small className="config-desc">
            {entityLabel} aparecerá com badge especial e terá prioridade na listagem
          </small>
        </div>
      </label>
    </div>
  </div>
);
