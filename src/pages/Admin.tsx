// src/pages/Admin.tsx
import { useEffect, useState, useMemo } from 'react';
import { db } from '../services/firebaseConfig';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardCharts } from '../components/DashboardCharts';
import { AdminImovelList } from '../components/AdminImovelList';
import { type Imovel } from '../types';
import { useSEO } from '../hooks/useSEO';
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

export const Admin = () => {
  useSEO({ title: 'Painel Administrativo', description: 'Dashboard de gerenciamento de imóveis.' });
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, venda, aluguel, rascunho
  const [busca, setBusca] = useState('');
  
  // Buscar imóveis
  const fetchImoveis = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "imoveis"));
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Imovel[];
      
      setImoveis(lista);
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  // Calcular Estatísticas (Memoized)
  const stats = useMemo((): Estatisticas => {
    const umMesAtras = new Date();
    umMesAtras.setDate(umMesAtras.getDate() - 30);

    return {
      totalImoveis: imoveis.length,
      imoveisAtivos: imoveis.filter(i => i.ativo !== false).length,
      imoveisVenda: imoveis.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos').length,
      imoveisAluguel: imoveis.filter(i => i.tipo === 'Aluguel' || i.tipo === 'Ambos').length,
      totalVisualizacoes: imoveis.reduce((acc, i) => acc + (i.visualizacoes || 0), 0),
      cadastradosUltimos30Dias: imoveis.filter(i => {
        if (!i.criadoEm) return false;
        const dataCriacao = 'toDate' in i.criadoEm
          ? i.criadoEm.toDate()
          : i.criadoEm instanceof Date
            ? i.criadoEm
            : new Date();
        return dataCriacao >= umMesAtras;
      }).length,
      semFoto: imoveis.filter(i => !i.imagens || i.imagens.length === 0).length,
      emDestaque: imoveis.filter(i => i.destaque === true).length,
      valorMedioVenda: Math.round(
        imoveis.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos')
          .reduce((acc, i) => acc + i.preco, 0) / 
        (imoveis.filter(i => i.tipo === 'Venda' || i.tipo === 'Ambos').length || 1)
      ),
    };
  }, [imoveis]);

  // Filtrar imóveis (Memoized)
  const imoveisFiltrados = useMemo(() => {
    return imoveis.filter(imovel => {
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
          (imovel.bairro && imovel.bairro.toLowerCase().includes(termos))
        );
      }
      
      return true;
    });
  }, [imoveis, filtro, busca]);

  // Top 5 mais visualizados (Memoized)
  const maisVisualizados = useMemo(() => {
    return [...imoveis]
      .filter(i => (i.visualizacoes || 0) > 0)
      .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
      .slice(0, 5);
  }, [imoveis]);

  // Distribuição por faixa de preço (Memoized)
  const faixasPreco = useMemo(() => {
    return {
      ate200k: imoveis.filter(i => i.preco <= 200000).length,
      de200a400k: imoveis.filter(i => i.preco > 200000 && i.preco <= 400000).length,
      de400a600k: imoveis.filter(i => i.preco > 400000 && i.preco <= 600000).length,
      acima600k: imoveis.filter(i => i.preco > 600000).length,
    };
  }, [imoveis]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir? Essa ação é permanente.");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "imoveis", id));
      setImoveis(prev => prev.filter(imovel => imovel.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir.");
    }
  };

  const handleToggleStatus = async (id: string, statusAtual: boolean) => {
    try {
      const novoStatus = !statusAtual;
      await updateDoc(doc(db, "imoveis", id), {
        ativo: novoStatus
      });

      setImoveis(prev => prev.map(imovel => 
        imovel.id === id ? { ...imovel, ativo: novoStatus } : imovel
      ));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (loading) return (
    <div className="loading-state">
      Carregando painel...
    </div>
  );

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h2>📊 Dashboard Administrativo</h2>
        <p>Visão geral dos seus imóveis e estatísticas</p>
      </div>

      {/* Stats Components */}
      <DashboardStats stats={stats} />
      
      <DashboardCharts 
        faixasPreco={faixasPreco} 
        maisVisualizados={maisVisualizados} 
      />

      {/* List Component */}
      <AdminImovelList
        imoveis={imoveisFiltrados}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        filtro={filtro}
        setFiltro={setFiltro}
        busca={busca}
        setBusca={setBusca}
      />
    </div>
  );
};