// src/pages/Detalhes.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Detalhes } from './Detalhes';
import type { Imovel } from '../types';

// Imóvel de teste
const mockImovel: Imovel = {
  id: 'imovel-test-1',
  titulo: 'Casa Espaçosa com Piscina',
  descricao: 'Uma casa linda com muitos diferenciais.',
  tipo: 'Venda',
  preco: 480000,
  precoAluguel: 0,
  endereco: 'Rua das Flores, 45',
  bairro: 'Jardim das Rosas',
  cidade: 'Açailândia',
  area: 200,
  quartos: 4,
  suites: 2,
  banheiros: 3,
  vagas: 2,
  condominio: 0,
  iptu: 1500,
  piscina: true,
  churrasqueira: true,
  elevador: false,
  mobiliado: false,
  portaria: false,
  aceitaPet: true,
  imagens: ['https://example.com/foto1.jpg'],
  lat: -4.94,
  lng: -47.45,
  ativo: true,
  destaque: true,
};

// Imóvel relacionado (mesmo tipo e categoria)
const mockRelacionado: Imovel = {
  ...mockImovel,
  id: 'imovel-relacionado-1',
  titulo: 'Casa Relacionada no Mesmo Bairro',
};

// Mock dos hooks de dados
vi.mock('../hooks/useImovelDetalhes', () => ({
  useImovelDetalhes: () => ({ data: mockImovel, isLoading: false }),
}));

vi.mock('../hooks/useImoveis', () => ({
  useImoveis: () => ({ data: [mockImovel, mockRelacionado], isLoading: false }),
  IMOVEIS_QUERY_KEY: ['imoveis'],
}));

// Mock do AuthContext — visitante normal
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false, user: null }),
}));

// Mock do FavoritosContext (usado por ImovelCard dentro dos relacionados)
vi.mock('../contexts/FavoritosContext', () => ({
  useFavoritos: () => ({
    toggleFavorito: vi.fn(),
    isFavorito: () => false,
    count: 0,
    favoritos: [],
  }),
}));

// Mock do WhatsAppContext (usado por PriceCard)
vi.mock('../contexts/WhatsAppContext', () => ({
  useWhatsApp: () => ({
    message: 'Olá!',
    setMessage: vi.fn(),
    resetMessage: vi.fn(),
  }),
}));

// Mock do useParams para simular o id da URL
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'imovel-test-1' }),
  };
});

// Mock do Firebase (updateDoc de visualizações)
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  increment: vi.fn((n) => n),
}));
vi.mock('../services/firebaseConfig', () => ({ db: {} }));

// Mock do useSEO
vi.mock('../hooks/useSEO', () => ({
  useSEO: vi.fn(),
}));

const renderDetalhes = () =>
  render(
    <MemoryRouter>
      <Detalhes />
    </MemoryRouter>
  );

describe('Detalhes Component', () => {
  it('deve renderizar o título do imóvel', () => {
    renderDetalhes();
    expect(screen.getByText('Casa Espaçosa com Piscina')).toBeInTheDocument();
  });

  it('deve exibir o endereço e cidade do imóvel', () => {
    renderDetalhes();
    // O endereço também aparece nos cards relacionados, usamos getAllByText
    const enderecoElements = screen.getAllByText(/Rua das Flores, 45/i);
    expect(enderecoElements.length).toBeGreaterThanOrEqual(1);
    const bairroElements = screen.getAllByText(/Jardim das Rosas/i);
    expect(bairroElements.length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir o tipo de negócio (Venda)', () => {
    renderDetalhes();
    // "Venda" aparece no badge do imóvel principal e nos cards relacionados
    const vendaElements = screen.getAllByText('Venda');
    expect(vendaElements.length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir as características: quartos, banheiros e área', () => {
    renderDetalhes();
    // Características aparecem tanto no detalhe quanto nos cards relacionados
    const quartoElements = screen.getAllByText('4');
    expect(quartoElements.length).toBeGreaterThanOrEqual(1);
    const banheiroElements = screen.getAllByText('3');
    expect(banheiroElements.length).toBeGreaterThanOrEqual(1);
    // A área pode aparecer formatada de formas diferentes
    expect(screen.getAllByText(/200/).length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir a seção "Destaque" na tag do imóvel', () => {
    renderDetalhes();
    expect(screen.getByText('Destaque')).toBeInTheDocument();
  });

  it('deve exibir o botão de compartilhar', () => {
    renderDetalhes();
    expect(screen.getByRole('button', { name: /compartilhar/i })).toBeInTheDocument();
  });

  it('visitante NÃO deve ver o botão de editar', () => {
    renderDetalhes();
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument();
  });

  it('deve exibir imóveis relacionados na mesma categoria', () => {
    renderDetalhes();
    expect(screen.getByText('Casa Relacionada no Mesmo Bairro')).toBeInTheDocument();
  });
});

describe('Detalhes Component — layout e compartilhamento', () => {
  it('deve renderizar a descrição do imóvel', () => {
    renderDetalhes();
    expect(screen.getByText(/Uma casa linda com muitos diferenciais/i)).toBeInTheDocument();
  });
});

