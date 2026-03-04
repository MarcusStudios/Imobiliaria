// src/components/form/FormHeader.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface FormHeaderProps {
  id?: string;
  title: string;        // e.g. "🏠 Cadastrar Novo Imóvel" or "✏️ Editar Imóvel"
  subtitle: string;     // e.g. "Preencha os dados..." or "Atualize as informações..."
  onMock?: () => void;  // se undefined, botão de mock fica oculto
  backTo?: string;      // rota de volta, padrão "/admin"
}

export const FormHeader = ({
  id,
  title,
  subtitle,
  onMock,
  backTo = '/admin',
}: FormHeaderProps) => (
  <div className="cadastro-header">
    <Link to={backTo} className="back-link">
      <ArrowLeft size={18} /> Voltar ao painel
    </Link>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {!id && onMock && (
        <button
          type="button"
          onClick={onMock}
          className="mock-btn"
          style={{
            padding: '8px 16px', backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe',
            borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '8px', fontWeight: '500', color: '#4f46e5'
          }}
        >
          🪄 Preencher com Dados de Teste
        </button>
      )}
    </div>
  </div>
);
