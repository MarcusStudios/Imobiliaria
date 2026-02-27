// src/pages/Favoritos.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImovelCard } from '../components/ImovelCard';
import { useFavoritos } from '../contexts/FavoritosContext';
import { useSEO } from '../hooks/useSEO';

export const Favoritos = () => {
  useSEO({ title: 'Meus Favoritos', description: 'Seus imóveis favoritos salvos para consulta rápida.' });
  const { favoritos } = useFavoritos();

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Cabeçalho com botão de voltar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Voltar
        </Link>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Meus Favoritos ❤️</h1>
      </div>

      {favoritos.length === 0 ? (
        // --- ESTADO VAZIO ---
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <h3>Você ainda não tem favoritos.</h3>
          <p style={{ marginTop: '0.5rem' }}>Que tal explorar alguns imóveis e salvar os que mais gostar?</p>
          <Link to="/" className="btn-details" style={{ display: 'inline-block', width: 'auto', marginTop: '1.5rem', padding: '0.8rem 2rem' }}>
            Explorar Imóveis
          </Link>
        </div>
      ) : (
        // --- LISTA DE FAVORITOS ---
        // Usamos a mesma classe de grid da Home para manter o padrão visual
        <div className="imoveis-grid">
          {favoritos.map((imovel) => (
             <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
};