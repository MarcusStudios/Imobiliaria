// src/components/form/FormCostsSection.tsx
import type { ChangeEvent } from 'react';
import type { Imovel } from '../../types';

interface FormCostsSectionProps {
  formData: Partial<Imovel>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const FormCostsSection = ({ formData, handleChange }: FormCostsSectionProps) => (
  <div className="form-section">
    <h3 className="section-title">💰 Custos Adicionais</h3>
    <div className="grid-cols-2">
      <div>
        <label className="form-label" htmlFor="condominio-input">Condomínio (R$/mês)</label>
        <input
          id="condominio-input"
          name="condominio"
          type="number"
          value={formData.condominio || ''}
          onChange={handleChange}
          className="form-input"
          placeholder="450"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="iptu-input">IPTU (R$/ano)</label>
        <input
          id="iptu-input"
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
);
