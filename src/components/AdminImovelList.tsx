import { Link } from 'react-router-dom';
import { Tag, DollarSign, MapPin, Edit, Eye, EyeOff, Trash2, Search, Plus } from 'lucide-react';
import { type Imovel } from '../types';
import '../css/Admin.css';

interface AdminImovelListProps {
  imoveis: Imovel[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, statusAtual: boolean) => void;
  filtro: string;
  setFiltro: (filtro: string) => void;
  busca: string;
  setBusca: (busca: string) => void;
}

export const AdminImovelList = ({ 
  imoveis, 
  onDelete, 
  onToggleStatus,
  filtro,
  setFiltro,
  busca,
  setBusca
}: AdminImovelListProps) => {
  return (
    <>
      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="actions-header">
          <div className="filter-buttons">
            {['todos', 'ativos', 'venda', 'aluguel', 'rascunho'].map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`filter-btn ${filtro === f ? 'active' : 'inactive'}`}
              >
            {f === 'todos' ? 'Todos' : f === 'ativos' ? 'Ativos' : f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/admin/terrenos/novo" className="btn-new" style={{ backgroundColor: '#10b981' }}>
              <Plus size={20} /> Novo Terreno
            </Link>
            <Link to="/cadastro-imovel" className="btn-new">
              <Plus size={20} /> Novo Imóvel
            </Link>
          </div>

        </div>

        {/* Busca */}
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título, endereço ou bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="imoveis-list-container">
        <div className="list-header">
          <h3>📋 Lista de Imóveis ({imoveis.length})</h3>
        </div>

        <div className="list-content">
          {imoveis.map((imovel) => (
            <div 
              key={imovel.id} 
              className={`imovel-item ${imovel.ativo === false ? 'inactive' : imovel.destaque ? 'destaque' : 'active'}`}
            >
              <div className="imovel-info">
                <img 
                  src={imovel.imagens?.[0] || 'https://via.placeholder.com/100x100?text=Sem+Foto'} 
                  alt="Capa" 
                  className="imovel-thumb"
                />
                <div className="imovel-details">
                  <h4>{imovel.titulo} {imovel.destaque && <span className="badge-destaque">⭐ DESTAQUE</span>}</h4>
                  <div className="imovel-meta">
                    <span className="meta-row">
                      <Tag size={12} /> {imovel.tipo} • 
                      <DollarSign size={12} /> 
                      {Number(imovel.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                    <span className="meta-row">
                      <MapPin size={12} /> {imovel.endereco}
                      {imovel.bairro && ` - ${imovel.bairro}`}
                    </span>
                  </div>
                  {imovel.ativo === false && <span className="badge-draft">RASCUNHO</span>}
                </div>
              </div>

              <div className="item-actions">
                <Link to={imovel.categoria === 'Terreno' ? `/admin/terrenos/editar/${imovel.id}` : `/editar/${imovel.id}`} className="action-btn edit" title="Editar">
                  <Edit size={18} />
                </Link>


                <button
                  onClick={() => onToggleStatus(imovel.id, imovel.ativo ?? true)}
                  className={`action-btn toggle ${imovel.ativo === false ? 'inactive' : ''}`}
                  title={imovel.ativo === false ? "Publicar" : "Ocultar"}
                >
                  {imovel.ativo === false ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <button
                  onClick={() => onDelete(imovel.id)}
                  className="action-btn delete"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {imoveis.length === 0 && (
            <div className="empty-state-list">
              <p className="empty-title">
                {busca ? '🔍 Nenhum imóvel encontrado com esse termo' : '📭 Nenhum imóvel nesta categoria'}
              </p>
              <p className="empty-desc">
                {busca ? 'Tente buscar por outro termo' : 'Clique em "Novo Imóvel" para começar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
