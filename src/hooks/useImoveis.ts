import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import type { Imovel } from '../types';

// Chave da query para cache
export const IMOVEIS_QUERY_KEY = ['imoveis'];

export const useImoveis = () => {
  return useQuery({
    queryKey: IMOVEIS_QUERY_KEY,
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'imoveis'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Imovel[];
    },
    // Cache por 10 minutos (600000 ms)
    staleTime: 10 * 60 * 1000,
    // Manter garbage collection após 30 mins
    gcTime: 30 * 60 * 1000,
    // Não refazer refetch ao mudar de aba para economizar leituras
    refetchOnWindowFocus: false
  });
};
