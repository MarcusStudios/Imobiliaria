import { Home, Eye, Tag, DollarSign, Calendar, Star, ImageOff, TrendingUp } from 'lucide-react';
import '../css/Admin.css';

interface Estatisticas {
  totalImoveis: number;
  imoveisAtivos: number;
  imoveisVenda: number;
  imoveisAluguel: number;
  totalVisualizacoes: number;
  cadastradosUltimos30Dias: number;
  semFoto: number;
  emDestaque: number;
  valorMedioVenda: number;
}

interface DashboardStatsProps {
  stats: Estatisticas;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <>
      {/* Primary Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-content">
            <div>
              <p className="stat-title">Total de Imóveis</p>
              <h3 className="stat-value">{stats.totalImoveis}</h3>
            </div>
            <Home size={32} className="stat-icon" />
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-content">
            <div>
              <p className="stat-title">Ativos</p>
              <h3 className="stat-value">{stats.imoveisAtivos}</h3>
            </div>
            <Eye size={32} className="stat-icon" />
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-content">
            <div>
              <p className="stat-title">Para Venda</p>
              <h3 className="stat-value">{stats.imoveisVenda}</h3>
            </div>
            <Tag size={32} className="stat-icon" />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-content">
            <div>
              <p className="stat-title">Para Aluguel</p>
              <h3 className="stat-value">{stats.imoveisAluguel}</h3>
            </div>
            <DollarSign size={32} className="stat-icon" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="stats-grid">
        <div className="secondary-stats-card">
          <div className="stat-header">
            <Calendar size={20} color="#64748b" />
            <p>Novos (30 dias)</p>
          </div>
          <h3 className="stat-number">{stats.cadastradosUltimos30Dias}</h3>
        </div>

        <div className="secondary-stats-card">
          <div className="stat-header">
            <Star size={20} color="#fbbf24" />
            <p>Em Destaque</p>
          </div>
          <h3 className="stat-number">{stats.emDestaque}</h3>
        </div>

        <div className="secondary-stats-card">
          <div className="stat-header">
            <ImageOff size={20} color="#64748b" />
            <p>Sem Fotos</p>
          </div>
          <h3 className={`stat-number ${stats.semFoto > 0 ? 'red' : 'green'}`}>
            {stats.semFoto}
          </h3>
        </div>

        <div className="secondary-stats-card">
          <div className="stat-header">
            <TrendingUp size={20} color="#64748b" />
            <p>Valor Médio</p>
          </div>
          <h3 className="stat-number currency">
            {stats.valorMedioVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </h3>
        </div>
      </div>
    </>
  );
};
