// src/components/form/FormDescriptionSection.tsx
import type { ChangeEvent } from 'react';
import type { Imovel } from '../../types';

interface FormDescriptionSectionProps {
  formData: Partial<Imovel>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export const FormDescriptionSection = ({
  formData,
  handleChange,
  placeholder = 'Descreva em detalhes...',
}: FormDescriptionSectionProps) => (
  <div className="form-section">
    <h3 className="section-title">📝 Descrição Detalhada</h3>
    <label htmlFor="descricao-textarea" className="sr-only">Descrição</label>
    <textarea
      id="descricao-textarea"
      name="descricao"
      rows={8}
      value={formData.descricao}
      onChange={handleChange}
      className="form-input"
      placeholder={placeholder}
    />
    <p className="char-counter">{formData.descricao?.length || 0} caracteres</p>
  </div>
);
