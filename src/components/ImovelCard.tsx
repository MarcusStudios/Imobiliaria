// src/components/ImovelCard.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Imovel } from '../types';
import { useFavoritos } from '../contexts/FavoritosContext';

interface ImovelCardProps {
  imovel: Imovel;
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const isFav = isFavorito(imovel.id);
  const navigate = useNavigate();

  const [indiceImagem, setIndiceImagem] = useState(0);

  const listaImagens = imovel.imagens && imovel.imagens.length > 0
    ? imovel.imagens
    : ["/sem-foto.png"];

  const proximaImagem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndiceImagem((prev) => (prev + 1) % listaImagens.length);
  };

  const imagemAnterior = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndiceImagem((prev) => (prev - 1 + listaImagens.length) % listaImagens.length);
  };

  const formatar = (val: number) => Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      className="card"
      onClick={() => navigate(`/imovel/${imovel.id}`)}
    >
      <div className="card-img-wrapper">
        <img
          src={listaImagens[indiceImagem]}
          alt={imovel.titulo}
          className="card-img"
          loading="lazy"
        />

        <span className="badge-type">
          {imovel.tipo === 'Ambos' ? 'Venda/Aluguel' : imovel.tipo}
        </span>

        {imovel.destaque && (
          <span className="card-badge-destaque">
            ⭐ Destaque
          </span>
        )}

        {listaImagens.length > 1 && (
          <>
            <button
              className="card-arrow-btn card-arrow-btn--left"
              onClick={imagemAnterior}
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="card-arrow-btn card-arrow-btn--right"
              onClick={proximaImagem}
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          className={`btn-fav ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorito(imovel);
          }}
          title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{imovel.titulo}</h3>

        {/* Preço */}
        <div className="card-price-block">
          {imovel.tipo === 'Ambos' ? (
            <>
              <div className="card-price-row">
                Venda: <span className="card-price-value">{formatar(imovel.preco)}</span>
              </div>
              {imovel.precoAluguel && (
                <div className="card-price-row">
                  Aluguel: <span className="card-price-value card-price-value--green">{formatar(imovel.precoAluguel)}</span>
                </div>
              )}
            </>
          ) : (
            <span className="card-price-single">{formatar(imovel.preco)}</span>
          )}
        </div>

        <p className="address">
          <MapPin size={14} className="address-icon" />
          {imovel.endereco}
        </p>

        <div className="features-row">
          {imovel.categoria === 'Terreno' ? (
            <>
              <span className="feat" title="Área Total"><Maximize size={16} /> {imovel.area}m²</span>
              {imovel.dimensoes && <span className="feat" title="Dimensões">📐 {imovel.dimensoes}</span>}
              <span className="feat card-badge-categoria">Terreno</span>
            </>
          ) : (
            <>
              <span className="feat" title="Quartos"><Bed size={16} /> {imovel.quartos}</span>
              <span className="feat" title="Banheiros"><Bath size={16} /> {imovel.banheiros}</span>
              <span className="feat" title="Área"><Maximize size={16} /> {imovel.area}m²</span>
            </>
          )}
        </div>

        <Link
          to={`/imovel/${imovel.id}`}
          className="btn-details"
          onClick={(e) => e.stopPropagation()}
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};