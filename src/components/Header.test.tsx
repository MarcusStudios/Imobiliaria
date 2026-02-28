// src/components/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock do FavoritosContext
vi.mock('../contexts/FavoritosContext', () => ({
  useFavoritos: () => ({
    count: 3,
    favoritos: [],
    toggleFavorito: vi.fn(),
    isFavorito: vi.fn(),
    setFavoritos: vi.fn(),
  }),
}));

// Mock do useLocation (para evitar dependência real do router)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Header Component', () => {
  it('deve renderizar o logo com o nome da corretora', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Lidiany Lopes')).toBeInTheDocument();
    expect(screen.getByText(/Corretora.*Moriá Imóveis/i)).toBeInTheDocument();
  });

  it('deve renderizar os links de navegação principais', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    // Pega todos os links com o texto "Início" (há um no desktop e um no mobile)
    const inicioLinks = screen.getAllByText('Início');
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);

    const comprarLinks = screen.getAllByText('Comprar');
    expect(comprarLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir a contagem de favoritos quando count > 0', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    // O mock retorna count=3, então deve aparecer "3" (badge de favoritos)
    const badges = screen.getAllByText('3');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('deve abrir o menu mobile ao clicar no botão hamburger', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // O botão hamburger tem aria-label "Abrir Menu"
    const btnAbrir = screen.getByRole('button', { name: /Abrir Menu/i });
    expect(btnAbrir).toBeInTheDocument();

    fireEvent.click(btnAbrir);

    // Após clicar, o overlay deve ter a classe "open"
    const overlay = document.querySelector('.mobile-menu-overlay');
    expect(overlay?.classList.contains('open')).toBe(true);
  });

  it('deve fechar o menu mobile ao clicar no botão de fechar', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Abre o menu
    const btnAbrir = screen.getByRole('button', { name: /Abrir Menu/i });
    fireEvent.click(btnAbrir);

    // Fecha o menu
    const btnFechar = screen.getByRole('button', { name: /Fechar Menu/i });
    fireEvent.click(btnFechar);

    const overlay = document.querySelector('.mobile-menu-overlay');
    expect(overlay?.classList.contains('open')).toBe(false);
  });

  it('botão hamburger deve ter aria-label "Abrir Menu"', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Abrir Menu/i })).toBeInTheDocument();
  });
});
