import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CadastroImovel } from './CadastroImovel';

// 1. Mock do Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('../../services/firebaseConfig', () => ({
  db: {},
}));

// 2. Mock do React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: undefined }), // undefined significa "Novo Cadastro"
  };
});

// 3. Mock do Serviço de Cloudinary (Imagens)
vi.mock('../services/cloudinaryService', () => ({
  uploadMultipleImages: vi.fn().mockResolvedValue(['url_imagem_1.jpg']),
  optimizeCloudinaryUrl: (url: string) => url,
}));

// Como a função scrollTo é chamada no window, precisamos mockar ela também
window.scrollTo = vi.fn();

describe('CadastroImovel Component', () => {
  it('deve renderizar a página de novo cadastro corretamente', () => {
    render(
      <MemoryRouter>
        <CadastroImovel />
      </MemoryRouter>
    );

    // Verifica se os títulos principais da página aparecem
    expect(screen.getByText('🏠 Cadastrar Novo Imóvel')).toBeInTheDocument();
    expect(screen.getByText('Preencha os dados do novo imóvel')).toBeInTheDocument();
  });

  it('deve exibir mensagens de erro ao tentar salvar sem preencher os campos obrigatórios', async () => {
    render(
      <MemoryRouter>
        <CadastroImovel />
      </MemoryRouter>
    );

    // Encontra o botão de salvar, pega o formulário associado e envia
    const botaoSalvar = screen.getByRole('button', { name: /Cadastrar Imóvel/i });
    const form = botaoSalvar.closest('form')!;
    fireEvent.submit(form);

    // O componente rola a tela para cima ao dar erro (window.scrollTo)
    expect(window.scrollTo).toHaveBeenCalled();

    // Aguarda e verifica se as mensagens de erro aparecem na tela
    await waitFor(() => {
      expect(screen.getByText('Corrija os seguintes erros:')).toBeInTheDocument();
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Preço deve ser maior que zero')).toBeInTheDocument();
      expect(screen.getByText('Endereço é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Bairro é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Adicione pelo menos uma foto do imóvel')).toBeInTheDocument();
    });
  });

  it('deve permitir preencher o título do imóvel', () => {
    render(
      <MemoryRouter>
        <CadastroImovel />
      </MemoryRouter>
    );

    // Pega o input pelo label correspondente e simula a digitação
    const inputTitulo = screen.getByLabelText(/Título do Anúncio/i);
    fireEvent.change(inputTitulo, { target: { value: 'Casa com 3 Quartos' } });

    // Verifica se o valor foi atualizado
    expect(inputTitulo).toHaveValue('Casa com 3 Quartos');
  });
});
