// src/contexts/FavoritosContext.tsx
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useImoveis } from '../hooks/useImoveis';

import { type Imovel } from '../types';

interface FavoritosContextData {
  favoritos: Imovel[];
  favoritosIds: string[];
  toggleFavorito: (id: string) => Promise<void>;
  isFavorito: (id: string) => boolean;
  count: number;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

const STORAGE_KEY = '@lidiany:favoritos-ids';

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [rawFavoritosIds, setRawFavoritosIds] = useState<string[]>([]);
  const { user } = useAuth();
  const { data: todosImoveis = [] } = useImoveis();

  // Carrega os IDs salvos (Firebase ou localStorage)
  useEffect(() => {
    const carregarFavoritos = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().favoritosIds) {
            setRawFavoritosIds(docSnap.data().favoritosIds as string[]);
          } else if (docSnap.exists() && docSnap.data().favoritos) {
            // Migração: converte objetos antigos para IDs
            const ids = (docSnap.data().favoritos as Imovel[]).map(i => i.id);
            setRawFavoritosIds(ids);
            await setDoc(docRef, { favoritosIds: ids }, { merge: true });
          } else {
            setRawFavoritosIds([]);
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      } else {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
              // Migração: formato antigo era array de objetos Imovel
              const ids = parsed.map((i: Imovel) => i.id);
              setRawFavoritosIds(ids);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            } else {
              setRawFavoritosIds(parsed);
            }
          } catch {
            setRawFavoritosIds([]);
          }
        } else {
          setRawFavoritosIds([]);
        }
      }
    };
    carregarFavoritos();
  }, [user]);

  // IDs derivados: filtra órfãos (imóveis deletados do Firestore) sem usar setState
  const favoritosIds = useMemo(() => {
    if (rawFavoritosIds.length === 0 || todosImoveis.length === 0) return rawFavoritosIds;
    const idsExistentes = new Set(todosImoveis.map(i => i.id));
    return rawFavoritosIds.filter(id => idsExistentes.has(id));
  }, [rawFavoritosIds, todosImoveis]);

  // Sincroniza a limpeza de órfãos no Firebase/localStorage (só I/O, sem setState)
  useEffect(() => {
    if (favoritosIds.length === rawFavoritosIds.length) return;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, { favoritosIds }, { merge: true }).catch(console.error);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritosIds));
    }
  }, [favoritosIds, rawFavoritosIds.length, user]);

  // Resolve os objetos Imovel completos a partir dos IDs válidos
  const favoritos = useMemo(() => {
    return todosImoveis.filter(imovel => favoritosIds.includes(imovel.id));
  }, [todosImoveis, favoritosIds]);

  // Favoritar / Desfavoritar
  const toggleFavorito = async (id: string) => {
    const jaExiste = favoritosIds.includes(id);
    const novosIds = jaExiste
      ? favoritosIds.filter(fid => fid !== id)
      : [...favoritosIds, id];

    setRawFavoritosIds(novosIds);

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { favoritosIds: novosIds }, { merge: true });
      } catch (error) {
        console.error("Erro ao sincronizar favoritos:", error);
        setRawFavoritosIds(rawFavoritosIds); // revert em caso de erro
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosIds));
    }
  };

  const isFavorito = (id: string) => favoritosIds.includes(id);

  return (
    <FavoritosContext.Provider value={{ favoritos, favoritosIds, toggleFavorito, isFavorito, count: favoritos.length }}>
      {children}
    </FavoritosContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavoritos = () => useContext(FavoritosContext);