import { type Imovel } from '../types';
import '../css/Admin.css';

interface DashboardChartsProps {
  faixasPreco: {
    ate200k: number;
    de200a400k: number;
    de400a600k: number;
    acima600k: number;
  };
  maisVisualizados: Imovel[];
}

export const DashboardCharts = ({ faixasPreco, maisVisualizados }: DashboardChartsProps) => {
  const maxFaixa = Math.max(
    faixasPreco.ate200k, 
    faixasPreco.de200a400k, 
    faixasPreco.de400a600k, 
    faixasPreco.acima600k
  );

  return (
    <div className="charts-grid">
      {/* Price Distribution */}
      <div className="chart-card">
        <h3 className="chart-title">💰 Distribuição por Faixa de Preço</h3>
        <div className="chart-content">
          {[
            { label: 'Até R$ 200mil', valor: faixasPreco.ate200k, cor: '#22c55e' },
            { label: 'R$ 200mil - R$ 400mil', valor: faixasPreco.de200a400k, cor: '#3b82f6' },
            { label: 'R$ 400mil - R$ 600mil', valor: faixasPreco.de400a600k, cor: '#f59e0b' },
            { label: 'Acima de R$ 600mil', valor: faixasPreco.acima600k, cor: '#8b5cf6' },
          ].map((faixa, idx) => (
            <div key={idx} className="price-dist-item">
              <div className="price-dist-header">
                <span className="price-label">{faixa.label}</span>
                <span className="price-value">{faixa.valor}</span>
              </div>
              <div className="price-bar-bg">
                <div 
                  className="price-bar-fill"
                  style={{ 
                    width: `${maxFaixa > 0 ? (faixa.valor / maxFaixa) * 100 : 0}%`, 
                    background: faixa.cor
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Viewed */}
      <div className="chart-card">
        <h3 className="chart-title">🔥 Imóveis Mais Visualizados</h3>
        {maisVisualizados.length > 0 ? (
          <div className="top-viewed-list">
            {maisVisualizados.map((imovel, idx) => (
              <div 
                key={imovel.id} 
                className={`top-viewed-item ${idx === 0 ? 'highlight' : 'normal'}`}
              >
                <span className={`rank-badge ${idx === 0 ? 'highlight' : 'normal'}`}>
                  {idx + 1}
                </span>
                <div className="viewed-info">
                  <p className="viewed-title">{imovel.titulo}</p>
                  <p className="viewed-count">
                    {imovel.visualizacoes} visualizações
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state-text">
            Nenhuma visualização registrada ainda
          </p>
        )}
      </div>
    </div>
  );
};
