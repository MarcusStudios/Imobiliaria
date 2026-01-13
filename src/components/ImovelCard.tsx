// src/components/ImovelCard.tsx
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import type { Imovel } from '../types';
import { useFavoritos } from '../contexts/FavoritosContext';

interface ImovelCardProps {
  imovel: Imovel;
}
  
export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  // CORREÇÃO 1: Pegamos 'isFavorito' (função auxiliar) e 'toggleFavorito'
  const { toggleFavorito, isFavorito } = useFavoritos();
  
  // CORREÇÃO 2: Usamos a função auxiliar para checar pelo ID (já que 'favoritos' agora é uma lista de objetos)
  const isFav = isFavorito(imovel.id);

  // Proteção de imagem
  const capa = imovel.imagens && imovel.imagens.length > 0 
    ? imovel.imagens[0] 
    : "https://via.placeholder.com/400x300?text=Sem+Foto";

  const formatar = (val: number) => Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={capa} alt={imovel.titulo} className="card-img" />
        
        <span className="badge-type">
          {imovel.tipo === 'Ambos' ? 'Venda/Aluguel' : imovel.tipo}
        </span>
        
        <button 
          className={`btn-fav ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault(); // Não abrir o link do card
            // CORREÇÃO 3: Passamos o objeto 'imovel' INTEIRO para a função, não apenas o ID
            toggleFavorito(imovel); 
          }}
          title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{imovel.titulo}</h3>
        
        {/* Lógica de Preço (Mantida a original que você enviou) */}
        <div className="card-price" style={{ minHeight: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {imovel.tipo === 'Ambos' ? (
            <>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Venda: <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatar(imovel.preco)}</span>
              </div>
              {imovel.precoAluguel && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Aluguel: <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatar(imovel.precoAluguel)}</span>
                </div>
              )}
            </>
          ) : (
            <span style={{ fontSize: '1.25rem' }}>{formatar(imovel.preco)}</span>
          )}
        </div>

        <p className="address" style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "10px", marginTop: "5px" }}>
          <MapPin size={14} style={{ display: "inline", marginRight: "4px" }} />
          {imovel.endereco}
        </p>

        <div className="features-row">
          <span className="feat"><Bed size={16} /> {imovel.quartos}</span>
          <span className="feat"><Bath size={16} /> {imovel.banheiros}</span>
          <span className="feat"><Maximize size={16} /> {imovel.area}m²</span>
        </div>
        
        <Link to={`/imovel/${imovel.id}`} className="btn-details">Ver Detalhes</Link>
      </div>
    </div>
  );
};