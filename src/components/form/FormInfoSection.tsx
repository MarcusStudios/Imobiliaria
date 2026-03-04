// src/components/form/FormInfoSection.tsx
import type { ChangeEvent } from 'react';
import type { Imovel } from '../../types';

interface FormInfoSectionProps {
  formData: Partial<Imovel>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const FormInfoSection = ({ formData, handleChange }: FormInfoSectionProps) => (
  <div className="form-section">
    <h3 className="section-title">📋 Informações Principais</h3>
    <div className="grid-gap-1-5">
      <div>
        <label className="form-label" htmlFor="titulo-input">Título do Anúncio *</label>
        <input
          id="titulo-input"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="form-input"
          required
          placeholder="Ex: Apartamento Moderno no Centro com Vista"
        />
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
          <input
            id="preco-input"
            name="preco"
            type="number"
            value={formData.preco || ''}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="350000"
          />
        </div>

        {formData.tipo === 'Ambos' && (
          <div>
            <label className="form-label" htmlFor="preco-aluguel-input">Valor do Aluguel (R$) *</label>
            <input
              id="preco-aluguel-input"
              name="precoAluguel"
              type="number"
              value={formData.precoAluguel || ''}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="2500"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);
