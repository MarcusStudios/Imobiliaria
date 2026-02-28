// src/hooks/useImovelDetalhes.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import type { Imovel } from '../types';
import { IMOVEIS_QUERY_KEY } from './useImoveis';

export const useImovelDetalhes = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['imovel', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');

      // 1. Tenta encontrar no cache da lista primeiro (evita fetch desnecessário)
      const listaCache = queryClient.getQueryData<Imovel[]>(IMOVEIS_QUERY_KEY);
      if (listaCache) {
        const encontrado = listaCache.find(i => i.id === id);
        if (encontrado) return encontrado;
      }

      // 2. Se não estiver no cache, busca individualmente no Firebase
      const docSnap = await getDoc(doc(db, 'imoveis', id));
      if (!docSnap.exists()) throw new Error('Imóvel não encontrado');
      return { id: docSnap.id, ...docSnap.data() } as Imovel;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos (consistente com useImoveis)
    gcTime: 30 * 60 * 1000,    // 30 minutos
  });
};
