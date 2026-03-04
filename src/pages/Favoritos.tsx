// src/pages/Favoritos.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImovelCard } from '../components/ImovelCard';
import { useFavoritos } from '../contexts/FavoritosContext';
import { useSEO } from '../hooks/useSEO';
import '../css/Favoritos.css';

export const Favoritos = () => {
  useSEO({ title: 'Meus Favoritos', description: 'Seus imóveis favoritos salvos para consulta rápida.' });
  const { favoritos } = useFavoritos();

  return (
    <div className="container favoritos-page">

      {/* Cabeçalho com botão de voltar */}
      <div className="favoritos-header">
        <Link to="/" className="favoritos-back-link">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <h1 className="favoritos-title">Meus Favoritos ❤️</h1>
      </div>

      {favoritos.length === 0 ? (
        // --- ESTADO VAZIO ---
        <div className="favoritos-empty">
          <h3>Você ainda não tem favoritos.</h3>
          <p>Que tal explorar alguns imóveis e salvar os que mais gostar?</p>
          <Link to="/" className="btn-details favoritos-empty-cta">
            Explorar Imóveis
          </Link>
        </div>
      ) : (
        // --- LISTA DE FAVORITOS ---
        <div className="imoveis-grid">
          {favoritos.map((imovel) => (
             <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
};