import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ImovelCard } from './ImovelCard';
import type { Imovel } from '../types';

// Mock do FavoritosContext (simula a lógica de favoritos sem precisar de um Provider real)
const mockToggleFavorito = vi.fn();

vi.mock('../contexts/FavoritosContext', () => ({
  useFavoritos: () => ({
    toggleFavorito: mockToggleFavorito,
    isFavorito: (id: string) => id === '1', // Define que o imóvel de ID '1' é favorito
  }),
}));

const mockImovel: Imovel = {
  id: '1',
  titulo: 'Apartamento de Teste',
  descricao: 'Descrição do apartamento',
  tipo: 'Venda',
  preco: 500000,
  precoAluguel: 0,
  endereco: 'Rua das Flores, 123',
  bairro: 'Centro',
  cidade: 'São Paulo',
  area: 100,
  quartos: 3,
  suites: 1,
  banheiros: 2,
  vagas: 2,
  condominio: 500,
  iptu: 1000,
  piscina: true,
  churrasqueira: false,
  elevador: true,
  mobiliado: false,
  portaria: true,
  aceitaPet: true,
  imagens: ['img1.jpg', 'img2.jpg'],
  lat: 0,
  lng: 0,
  ativo: true,
  destaque: false,
};

describe('ImovelCard Component', () => {
  it('deve renderizar as informações básicas do imóvel corretamente', () => {
    // Renderizamos o componente dentro de um MemoryRouter pois ele usa o elemento <Link>
    render(
      <MemoryRouter>
        <ImovelCard imovel={mockImovel} />
      </MemoryRouter>
    );

    // Verificamos se os textos esperados estão na tela
    expect(screen.getByText('Apartamento de Teste')).toBeInTheDocument();
    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
    
    // Na nossa formatação Pt-BR usando toLocaleString, temos um espaço em não quebravel (\xa0) ou espaço comum
    // Então vamos localizar de uma forma mais segura pelo prefixo/valor
    const priceElement = screen.getByText(/500\.000,00/);
    expect(priceElement).toBeInTheDocument();
    
    expect(screen.getByText('Venda')).toBeInTheDocument();
  });

  it('deve alternar a imagem ao interagir com o carrossel (se houver mais de 1 foto)', () => {
    render(
      <MemoryRouter>
        <ImovelCard imovel={mockImovel} />
      </MemoryRouter>
    );

    // Pega a imagem exibida
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('img1.jpg');

    // Ao invés de buscar por getAllByRole, vamos pegar os botões pelas suas posições/eventos, 
    // ou simplesmente selecionando os elementos 'button' e pegando o "proximo" (normalmente o 2º)
    const botoes = screen.getAllByRole('button');
    // botoes[0] = voltar, botoes[1] = avancar, botoes[2] = favorito
    const botaoAvancar = botoes[1];
    
    // Simula clique de usuário
    fireEvent.click(botaoAvancar);

    // A imagem deve ter mudado para a segunda da lista
    expect(img.src).toContain('img2.jpg');
  });

  it('deve chamar a função de favoritar ao clicar no coração', () => {
    render(
      <MemoryRouter>
        <ImovelCard imovel={mockImovel} />
      </MemoryRouter>
    );

    // Como definimos no Mock que isFavorito('1') é true, o title do botão será "Remover dos favoritos"
    const botaoFav = screen.getByTitle('Remover dos favoritos');
    
    fireEvent.click(botaoFav);

    // O mock do toggleFavorito precisa ter sido chamado com o objeto do imóvel
    expect(mockToggleFavorito).toHaveBeenCalledWith(mockImovel);
  });
});
