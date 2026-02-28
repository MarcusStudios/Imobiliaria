// src/contexts/FavoritosContext.tsx
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useImoveis } from '../hooks/useImoveis';

// Importando o tipo do arquivo separado
import { type Imovel } from '../types';

interface FavoritosContextData {
  favoritos: Imovel[];        // Lista completa e atualizada dos imóveis favoritados
  favoritosIds: string[];     // Apenas os IDs (para verificações rápidas)
  toggleFavorito: (id: string) => Promise<void>;
  isFavorito: (id: string) => boolean;
  count: number;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

const STORAGE_KEY = '@lidiany:favoritos-ids';

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const { user } = useAuth();
  const { data: todosImoveis = [] } = useImoveis();

  // Efeito para carregar os IDs salvos
  useEffect(() => {
    const carregarFavoritos = async () => {
      if (user) {
        // Lógica logado (Firebase): salva/carrega apenas IDs
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().favoritosIds) {
            setFavoritosIds(docSnap.data().favoritosIds as string[]);
          } else if (docSnap.exists() && docSnap.data().favoritos) {
            // Migração: converte objetos antigos para IDs
            const ids = (docSnap.data().favoritos as Imovel[]).map(i => i.id);
            setFavoritosIds(ids);
            await setDoc(docRef, { favoritosIds: ids }, { merge: true });
          } else {
            setFavoritosIds([]);
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      } else {
        // Lógica deslogado (LocalStorage): salva/carrega apenas IDs
        const localData = localStorage.getItem(STORAGE_KEY);
        // Migração: suporte ao formato antigo (array de objetos)
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
              // Formato antigo: array de objetos Imovel
              const ids = parsed.map((i: Imovel) => i.id);
              setFavoritosIds(ids);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            } else {
              setFavoritosIds(parsed);
            }
          } catch {
            setFavoritosIds([]);
          }
        } else {
          setFavoritosIds([]);
        }
      }
    };
    carregarFavoritos();
  }, [user]);

  // Resolve os objetos Imovel completos e atualizados a partir dos IDs
  const favoritos = useMemo(() => {
    return todosImoveis.filter(imovel => favoritosIds.includes(imovel.id));
  }, [todosImoveis, favoritosIds]);

  // Função para Favoritar/Desfavoritar (agora só gerencia IDs)
  const toggleFavorito = async (id: string) => {
    const jaExiste = favoritosIds.includes(id);
    const novosIds = jaExiste
      ? favoritosIds.filter(fid => fid !== id)
      : [...favoritosIds, id];

    // Atualiza visualmente na hora
    setFavoritosIds(novosIds);

    // Salva no banco ou local
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { favoritosIds: novosIds }, { merge: true });
      } catch (error) {
        console.error("Erro ao sincronizar favoritos:", error);
        // Revert em caso de erro
        setFavoritosIds(favoritosIds);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosIds));
    }
  };

  const isFavorito = (id: string) => favoritosIds.includes(id);

  return (
    <FavoritosContext.Provider value={{ favoritos, favoritosIds, toggleFavorito, isFavorito, count: favoritosIds.length }}>
      {children}
    </FavoritosContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavoritos = () => useContext(FavoritosContext);