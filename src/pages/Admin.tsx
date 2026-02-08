// src/pages/Admin.tsx
import { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { Link } from 'react-router-dom'; 
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  DollarSign,
  Edit,
  TrendingUp,
  Home,
  Tag,
  Calendar,
  Star,
  ImageOff,
  Search
} from 'lucide-react';

interface Imovel {
  id: string;
  titulo: string;
  tipo: 'Venda' | 'Aluguel' | 'Ambos';
  preco: number;
  endereco: string;
  bairro?: string;
  imagens: string[];
  ativo?: boolean;
  destaque?: boolean;
  criadoEm?: any;
  visualizacoes?: number;
  quartos?: number;
  area?: number;
}

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

export const Admin = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, venda, aluguel, rascunho
  const [busca, setBusca] = useState('');
  const [stats, setStats] = useState<Estatisticas>({
    totalImoveis: 0,
    imoveisAtivos: 0,
    imoveisVenda: 0,
    imoveisAluguel: 0,
    totalVisualizacoes: 0,
    cadastradosUltimos30Dias: 0,
    semFoto: 0,
    emDestaque: 0,
    valorMedioVenda: 0,
  });

  // Buscar imóveis e calcular estatísticas
  const fetchImoveis = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "imoveis"));
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Imovel[];
      
      setImoveis(lista);
      calcularEstatisticas(lista);
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (lista: Imovel[]) => {
    const agora = new Date();
    const umMesAtras = new Date(agora.setDate(agora.getDate() - 30));

    const estatisticas: Estatisticas = {
      totalImoveis: lista.length,
      imoveisAtivos: lista.filter(i => i.ativo !== false).length,
      imoveisVenda: lista.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos').length,
      imoveisAluguel: lista.filter(i => i.tipo === 'Aluguel' || i.tipo === 'Ambos').length,
      totalVisualizacoes: lista.reduce((acc, i) => acc + (i.visualizacoes || 0), 0),
      cadastradosUltimos30Dias: lista.filter(i => {
        if (!i.criadoEm) return false;
        const dataCriacao = i.criadoEm.toDate ? i.criadoEm.toDate() : new Date(i.criadoEm);
        return dataCriacao >= umMesAtras;
      }).length,
      semFoto: lista.filter(i => !i.imagens || i.imagens.length === 0).length,
      emDestaque: lista.filter(i => i.destaque).length,
      valorMedioVenda: Math.round(
        lista.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos')
          .reduce((acc, i) => acc + i.preco, 0) / 
        lista.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos').length || 0
      ),
    };

    setStats(estatisticas);
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir? Essa ação é permanente.");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "imoveis", id));
      const novaLista = imoveis.filter(imovel => imovel.id !== id);
      setImoveis(novaLista);
      calcularEstatisticas(novaLista);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir.");
    }
  };

  const handleToggleStatus = async (id: string, statusAtual?: boolean) => {
    try {
      const novoStatus = !statusAtual;
      await updateDoc(doc(db, "imoveis", id), {
        ativo: novoStatus
      });

      const novaLista = imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, ativo: novoStatus } : imovel
      );
      setImoveis(novaLista);
      calcularEstatisticas(novaLista);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Filtrar imóveis
  const imoveisFiltrados = imoveis.filter(imovel => {
    // Filtro por tipo
    if (filtro === 'venda' && imovel.tipo !== 'Venda' && imovel.tipo !== 'Ambos') return false;
    if (filtro === 'aluguel' && imovel.tipo !== 'Aluguel' && imovel.tipo !== 'Ambos') return false;
    if (filtro === 'rascunho' && imovel.ativo !== false) return false;
    if (filtro === 'ativos' && imovel.ativo === false) return false;
    
    // Busca por texto
    if (busca) {
      const termos = busca.toLowerCase();
      return (
        imovel.titulo.toLowerCase().includes(termos) ||
        imovel.endereco.toLowerCase().includes(termos) ||
        imovel.bairro?.toLowerCase().includes(termos)
      );
    }
    
    return true;
  });

  // Top 5 mais visualizados
  const maisVisualizados = [...imoveis]
    .filter(i => (i.visualizacoes || 0) > 0)
    .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
    .slice(0, 5);

  // Distribuição por faixa de preço
  const faixasPreco = {
    ate200k: imoveis.filter(i => i.preco <= 200000).length,
    de200a400k: imoveis.filter(i => i.preco > 200000 && i.preco <= 400000).length,
    de400a600k: imoveis.filter(i => i.preco > 400000 && i.preco <= 600000).length,
    acima600k: imoveis.filter(i => i.preco > 600000).length,
  };

  const maxFaixa = Math.max(faixasPreco.ate200k, faixasPreco.de200a400k, faixasPreco.de400a600k, faixasPreco.acima600k);

  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', padding:'4rem', color:'#64748b'}}>
      Carregando painel...
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊 Dashboard Administrativo</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Visão geral dos seus imóveis e estatísticas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Total de Imóveis</p>
              <h3 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 700 }}>{stats.totalImoveis}</h3>
            </div>
            <Home size={32} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Ativos</p>
              <h3 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 700 }}>{stats.imoveisAtivos}</h3>
            </div>
            <Eye size={32} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Para Venda</p>
              <h3 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 700 }}>{stats.imoveisVenda}</h3>
            </div>
            <Tag size={32} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Para Aluguel</p>
              <h3 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 700 }}>{stats.imoveisAluguel}</h3>
            </div>
            <DollarSign size={32} style={{ opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Segunda linha de cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Calendar size={20} color="#64748b" />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Novos (30 dias)</p>
          </div>
          <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{stats.cadastradosUltimos30Dias}</h3>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Star size={20} color="#fbbf24" />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Em Destaque</p>
          </div>
          <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{stats.emDestaque}</h3>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ImageOff size={20} color="#64748b" />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Sem Fotos</p>
          </div>
          <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: stats.semFoto > 0 ? '#ef4444' : '#10b981' }}>
            {stats.semFoto}
          </h3>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={20} color="#64748b" />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Valor Médio</p>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
            {stats.valorMedioVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </h3>
        </div>
      </div>

      {/* Gráficos e Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Distribuição por Preço */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: '#1e293b' }}>💰 Distribuição por Faixa de Preço</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Até R$ 200mil', valor: faixasPreco.ate200k, cor: '#22c55e' },
              { label: 'R$ 200mil - R$ 400mil', valor: faixasPreco.de200a400k, cor: '#3b82f6' },
              { label: 'R$ 400mil - R$ 600mil', valor: faixasPreco.de400a600k, cor: '#f59e0b' },
              { label: 'Acima de R$ 600mil', valor: faixasPreco.acima600k, cor: '#8b5cf6' },
            ].map((faixa, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{faixa.label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{faixa.valor}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#f1f5f9', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${maxFaixa > 0 ? (faixa.valor / maxFaixa) * 100 : 0}%`, 
                    height: '100%', 
                    background: faixa.cor,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mais Visualizados */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          borderRadius: '12px',
        }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: '#1e293b' }}>🔥 Imóveis Mais Visualizados</h3>
          {maisVisualizados.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {maisVisualizados.map((imovel, idx) => (
                <div key={imovel.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: idx === 0 ? '#fef3c7' : '#f8fafc',
                  borderRadius: '6px'
                }}>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '1.25rem', 
                    color: idx === 0 ? '#f59e0b' : '#64748b',
                    minWidth: '24px'
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {imovel.titulo}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                      {imovel.visualizacoes} visualizações
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
              Nenhuma visualização registrada ainda
            </p>
          )}
        </div>
      </div>

      {/* Barra de Ações e Filtros */}
      <div style={{ 
        background: 'white',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['todos', 'ativos', 'venda', 'aluguel', 'rascunho'].map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: filtro === f ? 'var(--primary)' : '#f1f5f9',
                  color: filtro === f ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'todos' ? 'Todos' : f === 'ativos' ? 'Ativos' : f}
              </button>
            ))}
          </div>

          <Link 
            to="/cadastro-imovel" 
            className="btn-details"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              textDecoration: 'none',
              background: 'var(--primary)',
              color: 'white',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            <Plus size={20} /> Novo Imóvel
          </Link>
        </div>

        {/* Busca */}
        <div style={{ marginTop: '1rem', position: 'relative' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#94a3b8'
          }} />
          <input
            type="text"
            placeholder="Buscar por título, endereço ou bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Lista de Imóveis */}
      <div style={{ 
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>
            📋 Lista de Imóveis ({imoveisFiltrados.length})
          </h3>
        </div>

        <div style={{ display: 'grid', gap: '1px', background: '#e2e8f0' }}>
          {imoveisFiltrados.map((imovel) => (
            <div 
              key={imovel.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                opacity: imovel.ativo === false ? 0.6 : 1,
                background: imovel.ativo === false ? '#f8fafc' : 'white',
                borderLeft: imovel.ativo === false ? '4px solid #94a3b8' : imovel.destaque ? '4px solid #fbbf24' : '4px solid #22c55e'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <img 
                  src={imovel.imagens?.[0] || 'https://via.placeholder.com/100x100?text=Sem+Foto'} 
                  alt="Capa" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0'
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{imovel.titulo}</h4>
                    {imovel.destaque && (
                      <span style={{ fontSize: '0.75rem', background: '#fbbf24', color: '#78350f', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        ⭐ DESTAQUE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection:'column', gap: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tag size={12} /> {imovel.tipo} • 
                      <DollarSign size={12} /> 
                      {Number(imovel.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {imovel.endereco}
                      {imovel.bairro && ` - ${imovel.bairro}`}
                    </span>
                  </div>
                  {imovel.ativo === false && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: '#94a3b8', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      marginTop:'6px', 
                      display:'inline-block',
                      fontWeight: 600
                    }}>
                      RASCUNHO
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/editar/${imovel.id}`}
                  title="Editar"
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #dbeafe',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#3b82f6',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Edit size={18} />
                </Link>

                <button
                  onClick={() => handleToggleStatus(imovel.id, imovel.ativo ?? true)}
                  title={imovel.ativo === false ? "Publicar" : "Ocultar"}
                  style={{
                    background: imovel.ativo === false ? '#f1f5f9' : '#f0fdf4',
                    border: imovel.ativo === false ? '1px solid #e2e8f0' : '1px solid #bbf7d0',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: imovel.ativo === false ? '#64748b' : '#16a34a',
                    transition: 'all 0.2s'
                  }}
                >
                  {imovel.ativo === false ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <button
                  onClick={() => handleDelete(imovel.id)}
                  title="Excluir"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    transition: 'all 0.2s'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {imoveisFiltrados.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#94a3b8',
              background: 'white'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {busca ? '🔍 Nenhum imóvel encontrado com esse termo' : '📭 Nenhum imóvel nesta categoria'}
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                {busca ? 'Tente buscar por outro termo' : 'Clique em "Novo Imóvel" para começar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};