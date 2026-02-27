import { ChevronsUpDown } from "lucide-react";
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





export const FilterBar = ({ filtros, setFiltros, ordem, setOrdem, onClear }: FilterBarProps) => {

  const update = (key: keyof Filtros, value: string | number) =>
    setFiltros({ ...filtros, [key]: value });

  return (
    <div className="filter-bar filter-bar--new-layout">
      {/* Row 1: Selects */}
      <div className="filter-bar__row-selects">
        <div className="filter-bar__select-wrapper">
          <select value={filtros.categoria} onChange={(e) => update("categoria", e.target.value)} className="filter-bar__select-input">
            <option value="">Categoria (Todas)</option>
            <option value="imoveis">Imóveis</option>
            <option value="terrenos">Terrenos</option>
          </select>
          <ChevronsUpDown size={14} className="filter-bar__select-icon" />
        </div>

        <div className="filter-bar__select-wrapper">
          <select value={filtros.tipo} onChange={(e) => update("tipo", e.target.value)} className="filter-bar__select-input">
            <option value="">Tipo (Todos)</option>
            <option value="comprar">Comprar</option>
            <option value="alugar">Alugar</option>
          </select>
          <ChevronsUpDown size={14} className="filter-bar__select-icon" />
        </div>

        <div className="filter-bar__select-wrapper">
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)} className="filter-bar__select-input">
            <option value="recentes">Mais Recentes</option>
            <option value="menor_preco">Menor Preço</option>
            <option value="maior_preco">Maior Preço</option>
          </select>
          <ChevronsUpDown size={14} className="filter-bar__select-icon" />
        </div>

        <div className="filter-bar__select-wrapper">
          <select value={filtros.quartos} onChange={(e) => update("quartos", Number(e.target.value))} className="filter-bar__select-input">
            <option value="0">Quartos (Qualquer)</option>
            <option value="1">1+ Quartos</option>
            <option value="2">2+ Quartos</option>
            <option value="3">3+ Quartos</option>
          </select>
          <ChevronsUpDown size={14} className="filter-bar__select-icon" />
        </div>

        <div className="filter-bar__select-wrapper">
          <select value={filtros.maxPreco} onChange={(e) => update("maxPreco", Number(e.target.value))} className="filter-bar__select-input">
            <option value="0">Valor (Sem Limite)</option>
            <option value="500000">Até R$ 500k</option>
            <option value="1000000">Até R$ 1M</option>
            <option value="2000000">Até R$ 2M</option>
            <option value="5000000">Até R$ 5M</option>
          </select>
          <ChevronsUpDown size={14} className="filter-bar__select-icon" />
        </div>
      </div>

      {/* Row 2: Search Input */}
      <div className="filter-bar__row-search">
        <input
          type="text"
          placeholder="palavra-chave"
          value={filtros.busca}
          onChange={(e) => update("busca", e.target.value)}
          className="filter-bar__search-input-field"
        />
      </div>

      {/* Row 3: Actions */}
      <div className="filter-bar__row-actions">
        <button className="filter-bar__btn-buscar" onClick={() => {
          // As a real-time filter, it already works, but we can scroll to results or just keep it as a UI anchor.
          const grid = document.querySelector(".imoveis-grid");
          if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>
          Buscar
        </button>
        <button onClick={onClear} className="filter-bar__btn-limpar">
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};