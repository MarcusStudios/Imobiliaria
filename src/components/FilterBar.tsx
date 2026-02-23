import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Home, Map, BedDouble, BadgeDollarSign, ArrowUpDown } from "lucide-react";
import "../css/Home.css";

interface Filtros {
  busca: string;
  categoria: string;
  tipo: string;
  quartos: number;
  maxPreco: number;
}

interface FilterBarProps {
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;
  ordem: string;
  setOrdem: (ordem: string) => void;
  onClear: () => void;
}

const QUARTOS_OPTIONS = [
  { label: "Qualquer", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
];

const PRECO_OPCOES = [
  { label: "Sem limite", value: 0 },
  { label: "R$ 500k", value: 500000 },
  { label: "R$ 1M", value: 1000000 },
  { label: "R$ 2M", value: 2000000 },
  { label: "R$ 5M", value: 5000000 },
];

const hasActiveFilters = (filtros: Filtros) =>
  filtros.busca !== "" ||
  filtros.categoria !== "" ||
  filtros.tipo !== "" ||
  filtros.quartos !== 0 ||
  filtros.maxPreco !== 0;

export const FilterBar = ({ filtros, setFiltros, ordem, setOrdem, onClear }: FilterBarProps) => {
  const [expanded, setExpanded] = useState(false);
  const active = hasActiveFilters(filtros);

  const update = (key: keyof Filtros, value: string | number) =>
    setFiltros({ ...filtros, [key]: value });

  return (
    <div className="filter-bar">

      {/* Top row: Search + toggle */}
      <div className="filter-bar__top-row">
        <div className="filter-bar__search-wrap">
          <Search size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Localização, bairro ou nome do imóvel…"
            value={filtros.busca}
            onChange={(e) => update("busca", e.target.value)}
            className="filter-bar__search-input"
          />
          {filtros.busca && (
            <button onClick={() => update("busca", "")} className="filter-bar__inline-clear" aria-label="Limpar busca">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className={`filter-bar__toggle ${expanded ? "filter-bar__toggle--active" : ""}`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {active && <span className="filter-bar__active-dot" />}
          <ChevronDown size={14} className={`filter-bar__toggle-chevron ${expanded ? "filter-bar__toggle-chevron--open" : ""}`} />
        </button>
      </div>

      {/* Expandable panel */}
      <div className={`filter-bar__panel ${expanded ? "filter-bar__panel--open" : ""}`}>
        <div className="filter-bar__grid">

          <div className="filter-group">
            <label><Home size={13} /> Categoria</label>
            <div className="filter-group__select-wrap">
              <select value={filtros.categoria} onChange={(e) => update("categoria", e.target.value)} className="input-control">
                <option value="">Todos</option>
                <option value="imoveis">Imóveis</option>
                <option value="terrenos">Terrenos</option>
              </select>
              <ChevronDown size={13} className="filter-bar__chevron-icon" />
            </div>
          </div>

          <div className="filter-group">
            <label><Map size={13} /> Finalidade</label>
            <div className="filter-group__pills">
              {(["", "comprar", "alugar"] as const).map((v) => (
                <button key={v} onClick={() => update("tipo", v)} className={`filter-group__pill ${filtros.tipo === v ? "filter-group__pill--active" : ""}`}>
                  {v === "" ? "Todas" : v === "comprar" ? "Comprar" : "Alugar"}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label><BedDouble size={13} /> Quartos</label>
            <div className="filter-group__pills">
              {QUARTOS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => update("quartos", opt.value)} className={`filter-group__pill ${filtros.quartos === opt.value ? "filter-group__pill--active" : ""}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label><BadgeDollarSign size={13} /> Preço Máximo</label>
            <div className="filter-group__pills">
              {PRECO_OPCOES.map((opt) => (
                <button key={opt.value} onClick={() => update("maxPreco", opt.value)} className={`filter-group__pill ${filtros.maxPreco === opt.value ? "filter-group__pill--active" : ""}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label><ArrowUpDown size={13} /> Ordenar por</label>
            <div className="filter-group__select-wrap">
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)} className="input-control">
                <option value="recentes">Mais Recentes</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
              </select>
              <ChevronDown size={13} className="filter-bar__chevron-icon" />
            </div>
          </div>

        </div>

        {active && (
          <div className="filter-bar__clear-row">
            <button onClick={onClear} className="filter-bar__clear-btn">
              <X size={13} /> Limpar filtros
            </button>
          </div>
        )}
      </div>

    </div>
  );
};