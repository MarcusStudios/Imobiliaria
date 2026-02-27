// src/pages/Home.tsx
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { ImovelCard } from "../components/ImovelCard";
import { FilterBar } from "../components/FilterBar";
import type { Imovel } from "../types";
import "../css/Home.css";

export const Home = () => {
  const [listaImoveis, setListaImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    categoria: "",
    tipo: "",
    quartos: 0,
    maxPreco: 0,
  });

  // Estado da Ordenação
  const [ordem, setOrdem] = useState("recente"); // recente, menor_preco, maior_preco

  // Busca dados reais do Firebase
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "imoveis"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Imovel[];

        // Filtra para mostrar apenas os ativos
        const imoveisAtivos = data.filter((imovel) => imovel.ativo !== false);

        setListaImoveis(imoveisAtivos);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImoveis();
  }, []);

  // 1. Lógica de Filtro (Memoized)
  const imoveisFiltrados = useMemo(() => {
    return listaImoveis.filter((imovel) => {
      // Texto
      const termoBusca = (filtros.busca || "").toLowerCase();
      const matchTexto =
        !termoBusca || // Fast failse se a busca estiver vazia
        (imovel.titulo && imovel.titulo.toLowerCase().includes(termoBusca)) ||
        (imovel.cidade && imovel.cidade.toLowerCase().includes(termoBusca)) ||
        (imovel.id && imovel.id.toLowerCase().includes(termoBusca)) ||
        (imovel.endereco && imovel.endereco.toLowerCase().includes(termoBusca)) ||
        (imovel.bairro && imovel.bairro.toLowerCase().includes(termoBusca));

      // Categoria (Terreno vs Imóvel Geral)
      let matchCategoria = true;
      if (filtros.categoria === "terrenos") {
        matchCategoria = imovel.categoria === "Terreno";
      } else if (filtros.categoria === "imoveis") {
        matchCategoria = imovel.categoria !== "Terreno";
      }

      // Tipo (Venda / Aluguel)
      let matchTipo = true;
      if (filtros.tipo === "comprar") {
        matchTipo = imovel.tipo === "Venda" || imovel.tipo === "Ambos";
      } else if (filtros.tipo === "alugar") {
        matchTipo = imovel.tipo === "Aluguel" || imovel.tipo === "Ambos";
      }

      // Preço (Inteligente para 'Ambos')
      let precoParaVerificar = imovel.preco || 0;
      if (
        filtros.tipo === "alugar" &&
        imovel.tipo === "Ambos" &&
        imovel.precoAluguel
      ) {
        precoParaVerificar = imovel.precoAluguel;
      }
      const matchPreco =
        filtros.maxPreco === 0 || precoParaVerificar <= filtros.maxPreco;

      // Quartos
      const matchQuartos = Number(imovel.quartos || 0) >= filtros.quartos;

      return matchTexto && matchCategoria && matchTipo && matchQuartos && matchPreco;
    });
  }, [listaImoveis, filtros]);

  // 2. Lógica de Ordenação (Memoized)
  const listaFinal = useMemo(() => {
    return [...imoveisFiltrados].sort((a, b) => {
      // Prioridade para imóveis em destaque
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;

      // Ordenação selecionada
      if (ordem === "menor_preco") return a.preco - b.preco;
      if (ordem === "maior_preco") return b.preco - a.preco;
      
      // Data de criação decrescente (mais recentes primeiro)
      const dateA = a.criadoEm?.toMillis?.() || 0;
      const dateB = b.criadoEm?.toMillis?.() || 0;
      return dateB - dateA;
    });
  }, [imoveisFiltrados, ordem]);

  const handleClearFilters = () => {
    setFiltros({
      busca: "",
      categoria: "",
      tipo: "",
      quartos: 0,
      maxPreco: 0,
    });
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="container hero-content">
          <h1>Seu novo lar está aqui.</h1>
          <p>As melhores oportunidades de compra e aluguel na sua região.</p>

          <div className="hero-filter-wrapper">
            {/* Barra de Filtros Componentizada */}
            <FilterBar
              filtros={filtros}
              setFiltros={setFiltros}
              ordem={ordem}
              setOrdem={setOrdem}
              onClear={handleClearFilters}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {/* Grid de Resultados */}
        {loading ? (
          <p className="loading-state">Carregando imóveis...</p>
        ) : (
          <div className="grid imoveis-grid">
            {listaFinal.length > 0 ? (
              listaFinal.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))
            ) : (
              // ESTADO VAZIO PROFISSIONAL
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3 className="empty-title">Nenhum imóvel encontrado</h3>
                <p className="empty-desc">
                  Tente ajustar seus filtros ou remover algumas restrições.
                </p>
                <button onClick={handleClearFilters} className="btn-clear">
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
