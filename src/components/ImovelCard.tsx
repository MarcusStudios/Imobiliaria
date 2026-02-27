// src/components/ImovelCard.tsx
import { useState } from 'react'; // IMPORTANTE: Importar useState
import { Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react'; // Adicionei as setas
import type { Imovel } from '../types';
import { useFavoritos } from '../contexts/FavoritosContext';

interface ImovelCardProps {
  imovel: Imovel;
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const isFav = isFavorito(imovel.id);
  const navigate = useNavigate();

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
    <div 
      className="card" 
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={() => navigate(`/imovel/${imovel.id}`)}
    >
      <div className="card-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* IMAGEM ATUAL DO CARROSSEL */}
        <img 
          src={listaImagens[indiceImagem]} 
          alt={imovel.titulo} 
          className="card-img" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Puxa o tamanho do wrapper via CSS
        />
        
        <span className="badge-type">
          {imovel.tipo === 'Ambos' ? 'Venda/Aluguel' : imovel.tipo}
        </span>

        {imovel.destaque && (
          <span style={{
            position: 'absolute',
            top: '44px',
            left: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            ⭐ Destaque
          </span>
        )}

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
          {imovel.categoria === 'Terreno' ? (
            <>
              <span className="feat" title="Área Total"><Maximize size={16} /> {imovel.area}m²</span>
              {imovel.dimensoes && <span className="feat" title="Dimensões">📐 {imovel.dimensoes}</span>}
              <span className="feat" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748b', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '4px', background: '#f8fafc' }}>Terreno</span>
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
          onClick={(e) => e.stopPropagation()} // Evita duplo clique com o card
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};