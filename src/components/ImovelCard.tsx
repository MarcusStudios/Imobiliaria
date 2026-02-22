// src/components/ImovelCard.tsx
import { useState } from 'react'; // IMPORTANTE: Importar useState
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react'; // Adicionei as setas
import type { Imovel } from '../types';
import { useFavoritos } from '../contexts/FavoritosContext';

interface ImovelCardProps {
  imovel: Imovel;
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const isFav = isFavorito(imovel.id);

  // 1. ESTADO PARA CONTROLAR A IMAGEM ATUAL NO CARD
  const [indiceImagem, setIndiceImagem] = useState(0);

  // 2. GARANTIR QUE TEMOS UMA LISTA DE IMAGENS VÁLIDA
  const listaImagens = imovel.imagens && imovel.imagens.length > 0 
    ? imovel.imagens 
    : ["https://via.placeholder.com/400x300?text=Sem+Foto"];

  // 3. FUNÇÕES DE NAVEGAÇÃO (Com stopPropagation para não abrir o link do imóvel)
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
    <div className="card" style={{ position: 'relative' }}>
      <div className="card-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* IMAGEM ATUAL DO CARROSSEL */}
        <img 
          src={listaImagens[indiceImagem]} 
          alt={imovel.titulo} 
          className="card-img" 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} // Garante tamanho fixo
        />
        
        <span className="badge-type">
          {imovel.tipo === 'Ambos' ? 'Venda/Aluguel' : imovel.tipo}
        </span>

        {/* SETAS DE NAVEGAÇÃO (Só aparecem se tiver mais de 1 imagem) */}
        {listaImagens.length > 1 && (
          <>
            <button
              onClick={imagemAnterior}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={proximaImagem}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronRight size={20} />
            </button>
            
            {/* INDICADOR DE CONTAGEM REMOVIDO PARA DESIGN MINIMALISTA */}
          </>
        )}
        
        {/* BOTÃO DE FAVORITO (Mantido no topo direito) */}
        <button 
          className={`btn-fav ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation(); // Importante
            toggleFavorito(imovel); 
          }}
          title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          style={{ zIndex: 20 }} // Garante que fique acima das setas se necessário
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{imovel.titulo}</h3>
        
        {/* Lógica de Preço */}
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