import { Search, Filter } from "lucide-react";
import "../css/Home.css";

interface Filtros {
  busca: string;
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

export const FilterBar = ({ filtros, setFiltros, ordem, setOrdem }: FilterBarProps) => {
  return (
    <div className="filter-bar">
      {/* Busca por Texto */}
      <div className="filter-group flex-grow">
        <label htmlFor="busca-input">Localização ou Nome</label>
        <div className="input-wrapper">
          <Search size={18} className="input-icon" />
          <input
            id="busca-input"
            type="text"
            className="input-control with-icon"
            placeholder="Ex: Centro, Apartamento..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
          />
        </div>
      </div>

      {/* Tipo */}
      <div className="filter-group">
        <label htmlFor="tipo-select">Finalidade</label>
        <div className="input-wrapper">
          <Filter size={18} className="input-icon" />
          <select
            id="tipo-select"
            className="input-control with-icon"
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
          >
            <option value="Todos">Todos</option>
            <option value="Venda">Comprar</option>
            <option value="Aluguel">Alugar</option>
          </select>
        </div>
      </div>

      {/* Quartos */}
      <div className="filter-group">
        <label htmlFor="quartos-select">Quartos</label>
        <select
          id="quartos-select"
          className="input-control"
          value={filtros.quartos}
          onChange={(e) => setFiltros({ ...filtros, quartos: Number(e.target.value) })}
        >
          <option value={0}>Qualquer</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
        </select>
      </div>

      {/* Preço Máximo */}
      <div className="filter-group">
        <label htmlFor="preco-input">Preço Máximo</label>
        <input
          id="preco-input"
          type="number"
          className="input-control"
          placeholder="R$ Máximo"
          value={filtros.maxPreco === 0 ? "" : filtros.maxPreco}
          onChange={(e) => setFiltros({ ...filtros, maxPreco: Number(e.target.value) })}
        />
      </div>

       {/* Ordenação */}
       <div className="filter-group">
        <label htmlFor="ordem-select">Ordenar por</label>
        <select
            id="ordem-select"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            className="input-control"
        >
            <option value="recente">Mais Recentes</option>
            <option value="menor_preco">Menor Preço</option>
            <option value="maior_preco">Maior Preço</option>
        </select>
      </div>
    </div>
  );
};
