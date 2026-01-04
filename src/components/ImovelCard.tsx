// src/components/ImovelCard.tsx
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import type { Imovel } from '../types';
import { useFavoritos } from '../contexts/FavoritosContext'; // <--- Importe o Hook

interface ImovelCardProps {
  imovel: Imovel;
  // Removemos as props isFav e onToggleFav, pois o card se vira sozinho agora
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  const { favoritos, toggleFavorito } = useFavoritos(); // <--- Usa o contexto
  const isFav = favoritos.includes(imovel.id);

  // Proteção de imagem
  const capa = imovel.imagens && imovel.imagens.length > 0 
    ? imovel.imagens[0] 
    : "https://via.placeholder.com/400x300?text=Sem+Foto";

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={capa} alt={imovel.titulo} className="card-img" />
        <span className="badge-type">{imovel.tipo}</span>
        
        <button 
          className={`btn-fav ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorito(imovel.id);
          }}
          title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {/* O fill preenche o coração se for favorito */}
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{imovel.titulo}</h3>
        <p className="card-price">
          {Number(imovel.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="address" style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "10px" }}>
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