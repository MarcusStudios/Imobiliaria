import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';

export const RotaPrivada = ({ children }: { children: ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="container">Carregando...</div>;

  // Se não estiver logado, manda pro Login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se estiver logado mas NÃO for o admin, manda pra Home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};