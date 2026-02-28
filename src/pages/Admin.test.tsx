// src/pages/Admin.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Admin } from './Admin';
import type { Imovel } from '../types';

// Mock do hook useImoveis (React Query)
const mockImoveis: Imovel[] = [
  {
    id: 'abc123',
    titulo: 'Casa Residencial no Centro',
    descricao: 'Linda casa',
    tipo: 'Venda',
    preco: 350000,
    precoAluguel: 0,
    endereco: 'Rua das Palmeiras, 10',
    bairro: 'Centro',
    cidade: 'Açailândia',
    area: 120,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    condominio: 0,
    iptu: 1200,
    piscina: false,
    churrasqueira: true,
    elevador: false,
    mobiliado: false,
    portaria: false,
    aceitaPet: true,
    imagens: ['img1.jpg'],
    lat: 0,
    lng: 0,
    ativo: true,
    destaque: false,
  },
  {
    id: 'def456',
    titulo: 'Apartamento para Alugar',
    descricao: 'Apto moderno',
    tipo: 'Aluguel',
    preco: 1500,
    precoAluguel: 0,
    endereco: 'Av. Central, 200',
    bairro: 'Jardim',
    cidade: 'Açailândia',
    area: 65,
    quartos: 2,
    suites: 0,
    banheiros: 1,
    vagas: 1,
    condominio: 300,
    iptu: 500,
    piscina: false,
    churrasqueira: false,
    elevador: true,
    mobiliado: true,
    portaria: true,
    aceitaPet: false,
    imagens: ['img2.jpg'],
    lat: 0,
    lng: 0,
    ativo: true,
    destaque: false,
  },
  {
    id: 'ghi789',
    titulo: 'Rascunho Interno',
    descricao: 'Imóvel rascunho',
    tipo: 'Venda',
    preco: 200000,
    precoAluguel: 0,
    endereco: 'Rua B, 5',
    bairro: 'Novo Bairro',
    cidade: 'Açailândia',
    area: 80,
    quartos: 2,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    condominio: 0,
    iptu: 0,
    piscina: false,
    churrasqueira: false,
    elevador: false,
    mobiliado: false,
    portaria: false,
    aceitaPet: false,
    imagens: [],
    lat: 0,
    lng: 0,
    ativo: false, // rascunho
    destaque: false,
  },
];

vi.mock('../hooks/useImoveis', () => ({
  useImoveis: () => ({ data: mockImoveis, isLoading: false }),
  IMOVEIS_QUERY_KEY: ['imoveis'],
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAdmin: true, user: { uid: 'admin' } }),
}));

vi.mock('../hooks/useSEO', () => ({
  useSEO: vi.fn(),
}));

// Mock do Firebase (não é chamado na renderização, mas importado)
vi.mock('firebase/firestore', () => ({
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));
vi.mock('../services/firebaseConfig', () => ({ db: {} }));

// Helper para renderizar com router
const renderAdmin = () =>
  render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>
  );

describe('Admin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o título do painel', () => {
    renderAdmin();
    expect(screen.getByText(/Dashboard Administrativo/i)).toBeInTheDocument();
  });

  it('deve exibir o total correto de imóveis nas estatísticas', () => {
    renderAdmin();
    // 3 imóveis no total
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('deve exibir a lista de imóveis cadastrados', () => {
    renderAdmin();
    expect(screen.getByText('Casa Residencial no Centro')).toBeInTheDocument();
    expect(screen.getByText('Apartamento para Alugar')).toBeInTheDocument();
  });

  it('deve filtrar por rascunho e exibir apenas imóveis inativos', async () => {
    const user = userEvent.setup();
    renderAdmin();

    // Clica no filtro de rascunho
    const btnRascunho = screen.getByRole('button', { name: /Rascunho/i });
    await user.click(btnRascunho);

    // Deve aparecer apenas "Rascunho Interno" (ativo: false)
    expect(screen.getByText('Rascunho Interno')).toBeInTheDocument();
    expect(screen.queryByText('Casa Residencial no Centro')).not.toBeInTheDocument();
  });

  it('deve filtrar por texto e encontrar imóvel pelo título', async () => {
    const user = userEvent.setup();
    renderAdmin();

    const inputBusca = screen.getByPlaceholderText(/Buscar por título/i);
    await user.type(inputBusca, 'Apartamento');

    expect(screen.getByText('Apartamento para Alugar')).toBeInTheDocument();
    expect(screen.queryByText('Casa Residencial no Centro')).not.toBeInTheDocument();
  });
});
