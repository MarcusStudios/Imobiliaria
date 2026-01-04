// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig'; // Caminho mantido conforme seu envio
import { ImovelCard } from '../components/ImovelCard';
import type { Imovel } from '../types';
import { Link } from 'react-router-dom';

// Não precisamos mais receber props do App.tsx!
export const Home = () => {
  const [listaImoveis, setListaImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado dos filtros
  const [filtros, setFiltros] = useState({ 
    busca: "", tipo: "Todos", quartos: 0, maxPreco: 0 
  });

  // Busca dados reais do Firebase
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "imoveis"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Imovel[];
        setListaImoveis(data);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImoveis();
  }, []);

  // Lógica de Filtro
  const imoveisFiltrados = listaImoveis.filter((imovel) => {
    const matchTexto = imovel.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchTipo = filtros.tipo === "Todos" || imovel.tipo === filtros.tipo;
    const matchQuartos = Number(imovel.quartos) >= filtros.quartos;
    const matchPreco = filtros.maxPreco === 0 || Number(imovel.preco) <= filtros.maxPreco;
    return matchTexto && matchTipo && matchQuartos && matchPreco;
  });

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Seu novo lar está aqui.</h1>
          <p>As melhores oportunidades de compra e aluguel na sua região.</p>
        </div>
      </div>
      
      <div className="container">
        {/* Barra de Filtros */}
        <div className="filter-bar">
          <div className="filter-group" style={{ flex: 2 }}>
            <label>Localização ou Nome</label>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 10, top: 12, color: "#94a3b8" }} />
              <input 
                type="text" 
                className="input-control" 
                style={{ paddingLeft: "35px" }} 
                placeholder="Ex: Centro, Apartamento..." 
                value={filtros.busca} 
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })} 
              />
            </div>
          </div>
          
           <div className="filter-group">
            <label>Finalidade</label>
            <select className="input-control" value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}>
              <option value="Todos">Todos</option>
              <option value="Venda">Comprar</option>
              <option value="Aluguel">Alugar</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Quartos</label>
            <select className="input-control" value={filtros.quartos} onChange={(e) => setFiltros({ ...filtros, quartos: Number(e.target.value) })}>
              <option value={0}>Qualquer</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
            </select>
          </div>
        </div>

        {/* Grid de Resultados */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando imóveis...</p>
        ) : (
          <div className="grid">
            {imoveisFiltrados.map((imovel) => (
              // MUDANÇA AQUI: O Card agora só recebe o 'imovel'. 
              // Ele pega os favoritos direto do Contexto.
              <ImovelCard 
                key={imovel.id} 
                imovel={imovel} 
              />
            ))}
            
            {imoveisFiltrados.length === 0 && (
              <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
                Nenhum imóvel encontrado. Cadastre um novo em <Link to="/admin">/admin</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};