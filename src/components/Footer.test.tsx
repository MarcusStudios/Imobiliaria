// src/components/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';

// Mock do WhatsAppContext (usado pelo WhatsAppButton dentro do Footer)
vi.mock('../contexts/WhatsAppContext', () => ({
  useWhatsApp: () => ({
    message: 'Olá! Gostaria de mais informações.',
    setMessage: vi.fn(),
    resetMessage: vi.fn(),
  }),
}));

describe('Footer Component', () => {
  it('deve renderizar o nome da empresa e Moria Imóveis', () => {
    render(<Footer />);
    // O nome aparece tanto no h3 como no parágrafo de direitos autorais
    const elementos = screen.getAllByText(/Lidiany Lopes.*Moria Imóveis/i);
    expect(elementos.length).toBeGreaterThanOrEqual(1);
    // Verifica especificamente o cabeçalho da marca
    const heading = document.querySelector('.footer-brand');
    expect(heading?.textContent).toMatch(/Lidiany Lopes/i);
  });

  it('deve exibir as informações de CRECI', () => {
    render(<Footer />);
    expect(screen.getByText(/CRECI-MA: 922-J/i)).toBeInTheDocument();
    expect(screen.getByText(/CRECI-MA: F4632/i)).toBeInTheDocument();
  });

  it('deve renderizar o link do WhatsApp com aria-label correto', () => {
    render(<Footer />);
    const whatsappLink = screen.getByRole('link', {
      name: /falar via whatsapp/i,
    });
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });

  it('deve renderizar o link do Instagram com aria-label correto', () => {
    render(<Footer />);
    const instagramLink = screen.getByRole('link', {
      name: /visitar instagram @moriaimoveis10/i,
    });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', expect.stringContaining('instagram.com'));
  });

  it('deve exibir o email de contato', () => {
    render(<Footer />);
    expect(screen.getByText(/moriaimoveis.atendimento@gmail.com/i)).toBeInTheDocument();
  });

  it('O botão flutuante do WhatsApp deve estar presente', () => {
    render(<Footer />);
    // WhatsAppButton renderiza um <a> com aria-label "Falar no WhatsApp"
    const floatBtn = screen.getByRole('link', { name: /falar no whatsapp/i });
    expect(floatBtn).toBeInTheDocument();
  });
});
