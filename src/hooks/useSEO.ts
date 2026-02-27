// src/hooks/useSEO.ts
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

/**
 * Hook customizado para atualizar title e meta description da página.
 * Alternativa ao react-helmet-async que não suporta React 19.
 */
export const useSEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    // Atualizar título
    const fullTitle = title
      ? `${title} | Lidiany Lopes - Moriá Imóveis`
      : 'Lidiany Lopes - Moriá Imóveis | Imóveis em Açailândia';
    document.title = fullTitle;

    // Atualizar meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // Cleanup: restaurar título padrão ao desmontar
    return () => {
      document.title = 'Lidiany Lopes - Moriá Imóveis | Imóveis em Açailândia';
    };
  }, [title, description]);
};
