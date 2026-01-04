// src/contexts/FavoritosContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface FavoritosContextData {
  favoritos: string[];
  toggleFavorito: (id: string) => void;
  count: number;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const saved = localStorage.getItem('imobireact_favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('imobireact_favs', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (id: string) => {
    setFavoritos(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, count: favoritos.length }}>
      {children}
    </FavoritosContext.Provider>
  );
}

// CORREÇÃO AQUI: Adicionamos este comentário para o Vite não reclamar da mistura de Hook com Componente
// eslint-disable-next-line react-refresh/only-export-components
export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
}