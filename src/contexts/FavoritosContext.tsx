// src/contexts/FavoritosContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Importando o tipo do arquivo separado
import { type Imovel } from '../types';

interface FavoritosContextData {
  favoritos: Imovel[];
  toggleFavorito: (imovel: Imovel) => Promise<void>;
  isFavorito: (id: string) => boolean;
  count: number;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<Imovel[]>([]);
  const { user } = useAuth();

  // Efeito para carregar os dados
  useEffect(() => {
    const carregarFavoritos = async () => {
      if (user) {
        // Lógica logado (Firebase)
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().favoritos) {
            setFavoritos(docSnap.data().favoritos);
          } else {
            setFavoritos([]);
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      } else {
        // Lógica deslogado (LocalStorage)
        const localData = localStorage.getItem('@lidiany:favoritos');
        if (localData) {
          setFavoritos(JSON.parse(localData));
        } else {
          setFavoritos([]);
        }
      }
    };
    carregarFavoritos();
  }, [user]);

  // Função para Favoritar/Desfavoritar
  const toggleFavorito = async (imovel: Imovel) => {
    const jaExiste = favoritos.some(item => item.id === imovel.id);
    let novaLista;

    if (jaExiste) {
      novaLista = favoritos.filter(item => item.id !== imovel.id);
    } else {
      novaLista = [...favoritos, imovel];
    }

    // Atualiza visualmente na hora
    setFavoritos(novaLista);

    // Salva no banco ou local
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        if (jaExiste) {
          await updateDoc(userRef, { favoritos: arrayRemove(imovel) });
        } else {
          // setDoc com merge garante que cria o doc se não existir
          await setDoc(userRef, { favoritos: arrayUnion(imovel) }, { merge: true });
        }
      } catch (error) {
        console.error("Erro ao sincronizar:", error);
      }
    } else {
      localStorage.setItem('@lidiany:favoritos', JSON.stringify(novaLista));
    }
  };

  const isFavorito = (id: string) => favoritos.some(item => item.id === id);

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito, count: favoritos.length }}>
      {children}
    </FavoritosContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavoritos = () => useContext(FavoritosContext);