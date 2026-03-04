// src/components/form/FormActions.tsx
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface FormActionsProps {
  id?: string;
  loading: boolean;
  uploadingImages: boolean;
  /** Label for the entity, e.g. "Imóvel" or "Terreno" */
  entityLabel: string;
  cancelTo?: string;
}

export const FormActions = ({
  id,
  loading,
  uploadingImages,
  entityLabel,
  cancelTo = '/admin',
}: FormActionsProps) => (
  <div className="form-actions">
    <Link to={cancelTo} className="btn-cancel">Cancelar</Link>
    <button type="submit" disabled={loading || uploadingImages} className="btn-submit">
      {uploadingImages ? (
        <>📤 Enviando imagens...</>
      ) : loading ? (
        <>💾 Salvando...</>
      ) : (
        <>
          <Check size={20} />
          {id ? `Atualizar ${entityLabel}` : `Cadastrar ${entityLabel}`}
        </>
      )}
    </button>
  </div>
);
