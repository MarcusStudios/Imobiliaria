import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';

// 1. Mock do useNavigate do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. Mock do AuthContext
const mockLogin = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('Login Component', () => {
  it('deve renderizar a página de login com os campos de email e senha', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verifica se os elementos principais estão na tela
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('deve alternar a visibilidade da senha ao clicar no ícone do olho', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const inputSenha = screen.getByPlaceholderText('Digite sua senha') as HTMLInputElement;

    // Inicialmente, a senha deve estar oculta (type="password")
    expect(inputSenha.type).toBe('password');

    // Infelizmente o botão do ícone não possui um aria-label ou name,
    // Mas podemos pegar ele navegando o DOM ou usando getAllByRole e pegando o primeiro botão
    const botoes = screen.getAllByRole('button');
    // botoes[0] = botão de mostrar/esconder senha, botoes[1] = botão de Entrar
    const btnMostrarSenha = botoes[0];

    // Clica para mostrar
    fireEvent.click(btnMostrarSenha);
    expect(inputSenha.type).toBe('text');

    // Clica para esconder de novo
    fireEvent.click(btnMostrarSenha);
    expect(inputSenha.type).toBe('password');
  });

  it('deve chamar a função de login ao submeter o formulário corretamente', () => {
    // Reseta o mock antes do teste para não acumular chamadas
    mockLogin.mockClear();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche os campos
    const inputEmail = screen.getByPlaceholderText('exemplo@email.com');
    const inputSenha = screen.getByPlaceholderText('Digite sua senha');
    
    fireEvent.change(inputEmail, { target: { value: 'teste@email.com' } });
    fireEvent.change(inputSenha, { target: { value: '123456' } });

    // Envia o formulário
    const btnEntrar = screen.getByRole('button', { name: /Entrar/i });
    const form = btnEntrar.closest('form')!;
    fireEvent.submit(form);

    // O mock precisa ter sido chamado com os valores corretos
    expect(mockLogin).toHaveBeenCalledWith('teste@email.com', '123456');
  });
});
