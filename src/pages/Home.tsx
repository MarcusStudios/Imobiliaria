// src/pages/Home.tsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ImovelCard } from "../components/ImovelCard";
import { ImovelCardSkeleton } from "../components/Skeleton";
import { FilterBar } from "../components/FilterBar";
import { useSEO } from "../hooks/useSEO";
import { useImoveis } from "../hooks/useImoveis";
import "../css/Home.css";
import "../css/Skeleton.css";

const ITEMS_PER_PAGE = 12;

export const Home = () => {
  useSEO({ title: 'Imóveis em Açailândia', description: 'Encontre casas, apartamentos e terrenos para compra e aluguel em Açailândia e região. Lidiany Lopes - Moriá Imóveis.' });
  const { data: todosImoveis, isLoading: loading } = useImoveis();
  const location = useLocation();

  const listaImoveis = useMemo(() => {
    if (!todosImoveis) return [];
    return todosImoveis.filter((imovel) => imovel.ativo !== false);
  }, [todosImoveis]);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    categoria: "",
    tipo: "",
    quartos: 0,
    maxPreco: 0,
  });

  // Estado da Ordenação
  const [ordem, setOrdem] = useState("recente");

  // Integrar o state do link "Comprar" do Header
  useEffect(() => {
    const state = location.state as { filtroTipo?: string } | null;
    if (state?.filtroTipo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiltros(prev => ({ ...prev, tipo: state.filtroTipo! }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // (Fetch substituído pelo React Query no topo do arquivo)

  // Resetar visibleCount quando filtros mudam
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filtros, ordem]);

  // 1. Lógica de Filtro (Memoized)
  const imoveisFiltrados = useMemo(() => {
    return listaImoveis.filter((imovel) => {
      const termoBusca = (filtros.busca || "").toLowerCase();
      const matchTexto =
        !termoBusca ||
        (imovel.titulo && imovel.titulo.toLowerCase().includes(termoBusca)) ||
        (imovel.cidade && imovel.cidade.toLowerCase().includes(termoBusca)) ||
        (imovel.id && imovel.id.toLowerCase().includes(termoBusca)) ||
        (imovel.endereco && imovel.endereco.toLowerCase().includes(termoBusca)) ||
        (imovel.bairro && imovel.bairro.toLowerCase().includes(termoBusca));

      let matchCategoria = true;
      if (filtros.categoria === "terrenos") {
        matchCategoria = imovel.categoria === "Terreno";
      } else if (filtros.categoria === "imoveis") {
        matchCategoria = imovel.categoria !== "Terreno";
      }

      let matchTipo = true;
      if (filtros.tipo === "comprar") {
        matchTipo = imovel.tipo === "Venda" || imovel.tipo === "Ambos";
      } else if (filtros.tipo === "alugar") {
        matchTipo = imovel.tipo === "Aluguel" || imovel.tipo === "Ambos";
      }

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

      const matchQuartos = Number(imovel.quartos || 0) >= filtros.quartos;

      return matchTexto && matchCategoria && matchTipo && matchQuartos && matchPreco;
    });
  }, [listaImoveis, filtros]);

  // 2. Lógica de Ordenação (Memoized)
  const listaOrdenada = useMemo(() => {
    return [...imoveisFiltrados].sort((a, b) => {
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;

      if (ordem === "menor_preco") return a.preco - b.preco;
      if (ordem === "maior_preco") return b.preco - a.preco;
      
      const getMs = (ts: typeof a.criadoEm) =>
        ts && 'toMillis' in ts ? ts.toMillis() : ts instanceof Date ? ts.getTime() : 0;
      return getMs(b.criadoEm) - getMs(a.criadoEm);
    });
  }, [imoveisFiltrados, ordem]);

  // 3. Paginação client-side
  const listaFinal = listaOrdenada.slice(0, visibleCount);
  const hasMore = visibleCount < listaOrdenada.length;

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
        <div
          className="grid imoveis-grid"
          aria-live="polite"
          aria-label="Lista de imóveis"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ImovelCardSkeleton key={i} />
            ))
          ) : listaFinal.length > 0 ? (
            listaFinal.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))
          ) : (
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

        {/* Botão Carregar Mais */}
        {!loading && hasMore && (
          <div className="load-more-container">
            <button
              className="btn-load-more"
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              aria-label={`Carregar mais imóveis. ${listaOrdenada.length - visibleCount} restantes`}
            >
              Carregar Mais Imóveis ({listaOrdenada.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
