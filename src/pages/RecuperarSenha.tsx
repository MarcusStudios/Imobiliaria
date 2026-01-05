import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

 const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      console.log("Tentando enviar email para:", email);
      
      await resetPassword(email);
      
      console.log("Firebase diz que enviou!");
      setMessage('Se o e-mail estiver cadastrado, você receberá um link em instantes.');
      setMessage(prev => prev + ' Verifique sua caixa de spam também.');
      
    } catch (err) {
      // 1. Removemos o ': any' lá de cima e tratamos aqui dentro
      console.error("ERRO FIREBASE:", err);
      
      // 2. Avisamos ao TypeScript que 'err' é um objeto que pode ter 'code' e 'message'
      const error = err as { code?: string; message?: string };

      if (error.code === 'auth/user-not-found') {
        setError('Este e-mail não está cadastrado no sistema.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Formato de e-mail inválido.');
      } else {
        setError('Erro: ' + (error.message || 'Falha desconhecida'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '400px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Recuperar Senha</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn-details" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Redefinir Senha'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)' }}>Voltar para Login</Link>
        </div>
      </div>
    </div>
  );
};