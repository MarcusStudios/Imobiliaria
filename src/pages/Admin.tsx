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
// Removido: useParams, useNavigate (se não for usado), addDoc
import { Link } from 'react-router-dom'; 
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  DollarSign,
  Edit // Adicionei o ícone de edição para ficar bonito
} from 'lucide-react';

// Interface simplificada apenas para o que usamos na LISTA
interface Imovel {
  id: string;
  titulo: string;
  preco: number; // ou string, dependendo de como salvou
  endereco: string;
  imagens: string[];
  ativo?: boolean;
}

export const Admin = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Função: APAGAR
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir? Essa ação é permanente.");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "imoveis", id));
      setImoveis(imoveis.filter(imovel => imovel.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir.");
    }
  };

  // Função: VISIBILIDADE
  const handleToggleStatus = async (id: string, statusAtual?: boolean) => {
    try {
      const novoStatus = !statusAtual; // Inverte
      // Atualiza no banco
      await updateDoc(doc(db, "imoveis", id), {
        ativo: novoStatus
      });

      // Atualiza na tela sem recarregar
      setImoveis(imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, ativo: novoStatus } : imovel
      ));

    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', padding:'4rem', color:'#64748b'}}>
      Carregando painel...
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Painel Administrativo</h2>
      </div>

      {/* Botão de Adicionar leva para a NOVA página de cadastro */}
      <Link 
        to="/cadastro-imovel" 
        className="btn-details"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '2rem',
          textDecoration: 'none',
          background: 'var(--primary)',
          color: 'white'
        }}
      >
        <Plus size={20} /> Adicionar Novo Imóvel
      </Link>

      <div className="admin-grid" style={{ display: 'grid', gap: '1rem' }}>
        {imoveis.map((imovel) => (
          <div 
            key={imovel.id} 
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1rem',
              opacity: imovel.ativo === false ? 0.6 : 1,
              background: imovel.ativo === false ? '#f1f5f9' : 'white',
              borderLeft: imovel.ativo === false ? '4px solid #94a3b8' : '4px solid #22c55e'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img 
                src={imovel.imagens?.[0] || 'https://via.placeholder.com/100'} 
                alt="Capa" 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{imovel.titulo}</h4>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection:'column', gap: '2px', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={12} /> {imovel.preco}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {imovel.endereco}
                  </span>
                </div>
                {imovel.ativo === false && (
                  <span style={{ fontSize: '0.7rem', background: '#94a3b8', color: 'white', padding: '2px 6px', borderRadius: '4px', marginTop:'4px', display:'inline-block' }}>
                    RASCUNHO
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              
              {/* Botão EDITAR (Leva para a página de edição) */}
              <Link
                to={`/editar/${imovel.id}`}
                title="Editar"
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#3b82f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Edit size={20} />
              </Link>

              {/* Botão OLHO (Publicar/Ocultar) */}
              <button
                onClick={() => handleToggleStatus(imovel.id, imovel.ativo ?? true)}
                title={imovel.ativo === false ? "Publicar" : "Ocultar"}
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: imovel.ativo === false ? '#64748b' : '#10b981',
                }}
              >
                {imovel.ativo === false ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {/* Botão LIXO (Excluir) */}
              <button
                onClick={() => handleDelete(imovel.id)}
                title="Excluir"
                style={{
                  background: '#fee2e2',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#ef4444',
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {imoveis.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Nenhum imóvel encontrado. Clique em "Adicionar" para começar.
          </div>
        )}
      </div>
    </div>
  );
};