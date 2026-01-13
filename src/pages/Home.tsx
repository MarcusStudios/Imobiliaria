// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { ImovelCard } from "../components/ImovelCard";
import type { Imovel } from "../types";

export const Home = () => {
  const [listaImoveis, setListaImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "Todos",
    quartos: 0,
    maxPreco: 0,
  });

  // Estado da Ordenação (NOVO)
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

        // --- MUDANÇA AQUI: Filtra para mostrar apenas os ativos ---
        // Se 'ativo' for undefined (imóveis antigos) ou true, ele mostra.
        // Se for false (você ocultou no admin), ele esconde.
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

  // 1. Lógica de Filtro
  const imoveisFiltrados = listaImoveis.filter((imovel) => {
    // Texto
    const matchTexto =
      imovel.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      (imovel.bairro &&
        imovel.bairro.toLowerCase().includes(filtros.busca.toLowerCase()));

    // Tipo
    const matchTipo =
      filtros.tipo === "Todos" ||
      imovel.tipo === filtros.tipo ||
      imovel.tipo === "Ambos";

    // Preço (Inteligente para 'Ambos')
    let precoParaVerificar = imovel.preco;
    if (
      filtros.tipo === "Aluguel" &&
      imovel.tipo === "Ambos" &&
      imovel.precoAluguel
    ) {
      precoParaVerificar = imovel.precoAluguel;
    }
    const matchPreco =
      filtros.maxPreco === 0 || precoParaVerificar <= filtros.maxPreco;

    // Quartos
    const matchQuartos = Number(imovel.quartos) >= filtros.quartos;

    return matchTexto && matchTipo && matchQuartos && matchPreco;
  });

  // 2. Lógica de Ordenação (Aplica sobre os filtrados) - NOVO
  const listaFinal = [...imoveisFiltrados].sort((a, b) => {
    if (ordem === "menor_preco") return a.preco - b.preco;
    if (ordem === "maior_preco") return b.preco - a.preco;
    return 0; // recente (ordem original)
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
          {/* Busca por Texto */}
          <div className="filter-group" style={{ flex: 2 }}>
            <label>Localização ou Nome</label>
            <div style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12,
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                className="input-control"
                style={{ paddingLeft: "35px" }}
                placeholder="Ex: Centro, Apartamento..."
                value={filtros.busca}
                onChange={(e) =>
                  setFiltros({ ...filtros, busca: e.target.value })
                }
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="filter-group">
            <label>Finalidade</label>
            <div style={{ position: "relative" }}>
              <Filter
                size={18}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12,
                  color: "#94a3b8",
                }}
              />
              <select
                className="input-control"
                style={{ paddingLeft: "35px" }}
                value={filtros.tipo}
                onChange={(e) =>
                  setFiltros({ ...filtros, tipo: e.target.value })
                }
              >
                <option value="Todos">Todos</option>
                <option value="Venda">Comprar</option>
                <option value="Aluguel">Alugar</option>
              </select>
            </div>
          </div>

          {/* Quartos */}
          <div className="filter-group">
            <label>Quartos</label>
            <select
              className="input-control"
              value={filtros.quartos}
              onChange={(e) =>
                setFiltros({ ...filtros, quartos: Number(e.target.value) })
              }
            >
              <option value={0}>Qualquer</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
            </select>
          </div>

          {/* Preço Máximo (NOVO) */}
          <div className="filter-group">
            <label>Preço Máximo</label>
            <input
              type="number"
              className="input-control"
              placeholder="R$ Máximo"
              value={filtros.maxPreco === 0 ? "" : filtros.maxPreco}
              onChange={(e) =>
                setFiltros({ ...filtros, maxPreco: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Barra de Ordenação (NOVO) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1rem 0 2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Ordenar por:
            </span>
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className="input-control"
              style={{
                width: "auto",
                padding: "0.5rem",
                fontSize: "0.9rem",
                height: "auto",
              }}
            >
              <option value="recente">Mais Recentes</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Grid de Resultados */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "4rem" }}>
            Carregando imóveis...
          </p>
        ) : (
          <div className="grid">
            {listaFinal.length > 0 ? (
              // Usa a listaFinal (ordenada)
              listaFinal.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))
            ) : (
              // ESTADO VAZIO PROFISSIONAL
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "4rem 1rem",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
                <h3 style={{ color: "#334155", marginBottom: "0.5rem" }}>
                  Nenhum imóvel encontrado
                </h3>
                <p style={{ color: "#64748b" }}>
                  Tente ajustar seus filtros ou remover algumas restrições.
                </p>
                <button
                  onClick={() =>
                    setFiltros({
                      busca: "",
                      tipo: "Todos",
                      quartos: 0,
                      maxPreco: 0,
                    })
                  }
                  className="btn-details"
                  style={{
                    marginTop: "1rem",
                    background: "var(--secondary)",
                    display: "inline-block",
                    width: "auto",
                  }}
                >
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
