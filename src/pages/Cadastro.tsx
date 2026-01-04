import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPass) {
      return setError('As senhas não coincidem.');
    }

    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password);
      navigate('/'); // Redireciona para Home após criar conta
    } catch (err: any) {
      // Tradução simples de erros comuns do Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado.');
      } else {
        setError('Falha ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '400px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Criar Conta</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Senha</label>
            <input type="password" className="input-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="label">Confirmar Senha</label>
            <input type="password" className="input-control" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn-details" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary)' }}>Entrar</Link>
        </div>
      </div>
    </div>
  );
};