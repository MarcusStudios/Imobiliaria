// src/pages/NaoEncontrado.tsx
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const NaoEncontrado = () => {
  useSEO({ title: 'Página Não Encontrada', description: 'A página que você procura não existe ou foi movida.' });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
        gap: '1rem',
        color: 'var(--text-main)',
      }}
    >
      <span style={{ fontSize: '5rem', lineHeight: 1 }}>🏚️</span>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
        Página não encontrada
      </h2>
      <p style={{ color: '#64748b', maxWidth: '400px', margin: 0 }}>
        O endereço que você procura não existe ou foi movido. Que tal voltar para a página inicial?
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: '2px solid var(--primary)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: 'white',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          <Home size={18} /> Ir para o Início
        </Link>
      </div>
    </div>
  );
};
