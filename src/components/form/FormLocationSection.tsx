// src/components/form/FormLocationSection.tsx
import type { ChangeEvent } from 'react';
import type { Imovel } from '../../types';

interface FormLocationSectionProps {
  formData: Partial<Imovel>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const FormLocationSection = ({ formData, handleChange }: FormLocationSectionProps) => (
  <div className="form-section">
    <h3 className="section-title">📍 Localização</h3>
    <div className="grid-gap-1-5">
      <div>
        <label className="form-label" htmlFor="endereco-input">Endereço Completo *</label>
        <input
          id="endereco-input"
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
          <label className="form-label" htmlFor="bairro-input">Bairro *</label>
          <input
            id="bairro-input"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Ex: Jardim Imperial"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cidade-input">Cidade</label>
          <input
            id="cidade-input"
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
);
