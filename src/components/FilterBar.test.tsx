import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';
import { describe, expect, it, vi } from 'vitest';

describe('Acessibilidade e Comportamento do FilterBar', () => {
  const mockSetFiltros = vi.fn();
  const mockSetOrdem = vi.fn();

  const defaultProps = {
    filtros: { busca: '', tipo: 'Todos', quartos: 0, maxPreco: 0 },
    setFiltros: mockSetFiltros,
    ordem: 'recente',
    setOrdem: mockSetOrdem,
    onClear: vi.fn(),
  };

  it('deve associar corretamente a label "Localização ou Nome" ao input de busca', async () => {
    // Renderiza o componente
    render(<FilterBar {...defaultProps} />);

    // 1. Tenta pegar o textbox (input type text) pela label dele
    // Como a label e o input não estão associados nativamente via "htmlFor" e "id", 
    // ou se o input não estiver dentro da label, este teste de acessibilidade deve bater
    const buscaInput = screen.getByRole('textbox', { name: /localização ou nome/i });
    
    expect(buscaInput).toBeInTheDocument();

    // 2. Simula o usuário digitando no input que encontramos
    await userEvent.type(buscaInput, 'Centro');

    // 3. Garante que nossa função mockada foi chamada simulando o React atualizando o estado
    expect(mockSetFiltros).toHaveBeenCalled();
  });
});
