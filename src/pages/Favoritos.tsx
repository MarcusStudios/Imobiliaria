import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig'; // Ajuste se necessário
import type { Imovel } from '../types';
import { ImovelCard } from '../components/ImovelCard'; // <--- Reutilize o Card!
import { useFavoritos } from '../contexts/FavoritosContext'; // <--- Contexto

export const Favoritos = () => {
  const { favoritos } = useFavoritos(); // <--- Pega IDs do contexto
  const [listaFavoritos, setListaFavoritos] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (favoritos.length === 0) {
        setListaFavoritos([]);
        setLoading(false);
        return;
      }

      try {
        // Busca simples (Melhoria futura: usar query 'in' do firebase para trazer só os necessários)
        const querySnapshot = await getDocs(collection(db, "imoveis"));
        const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel));
        
        // Filtra
        const apenasFavs = todos.filter(imovel => favoritos.includes(imovel.id));
        setListaFavoritos(apenasFavs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [favoritos]); // Recarrega se a lista de favoritos mudar

  if (loading) return <div className="container" style={{padding:'2rem'}}>Carregando...</div>;

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
             // Reutilizando o componente Card, ele já vem com o botão de coração funcionando
             <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
};