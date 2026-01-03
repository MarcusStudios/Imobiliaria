// src/pages/Favoritos.tsx
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Imovel } from '../types';

// Vamos precisar reutilizar o ImovelCard (poderíamos extrair ele para um componente separado também, mas vamos simplificar aqui)
// IMPORTANTE: Para isso funcionar 100% limpo, você deve mover o componente ImovelCard do App.tsx para src/components/ImovelCard.tsx
// Vou assumir que você fará isso ou copiará o card aqui. Para facilitar, vou fazer uma versão simples do card aqui.

export const Favoritos = ({ favoritosIds }: { favoritosIds: string[] }) => {
  const [listaFavoritos, setListaFavoritos] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (favoritosIds.length === 0) {
        setListaFavoritos([]);
        setLoading(false);
        return;
      }

      try {
        // O Firestore tem um limite para 'in', então se tiver muitos favoritos, o ideal é buscar tudo e filtrar no front
        // ou fazer em lotes. Vamos buscar tudo e filtrar no front pela simplicidade do tutorial.
        const querySnapshot = await getDocs(collection(db, "imoveis"));
        const data = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Imovel))
          .filter(imovel => favoritosIds.includes(imovel.id));
        
        setListaFavoritos(data);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [favoritosIds]);

  if (loading) return <div className="container" style={{padding:'2rem'}}>Carregando seus favoritos...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Meus Favoritos ❤️</h1>
      
      {listaFavoritos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3>Você ainda não tem favoritos.</h3>
          <Link to="/" className="btn-details" style={{ display: 'inline-block', width: 'auto', marginTop: '1rem' }}>
            Explorar Imóveis
          </Link>
        </div>
      ) : (
        <div className="grid">
          {listaFavoritos.map(imovel => (
            <div key={imovel.id} className="card">
               <div className="card-img-wrapper">
                 <img src={imovel.imagens[0]} alt={imovel.titulo} className="card-img" />
                 <span className="badge-type">{imovel.tipo}</span>
               </div>
               <div className="card-body">
                 <h3>{imovel.titulo}</h3>
                 <p className="price">R$ {imovel.preco.toLocaleString('pt-BR')}</p>
                 <Link to={`/imovel/${imovel.id}`} className="btn-details">Ver Detalhes</Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};