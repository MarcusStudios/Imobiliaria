// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError("Falha ao entrar. Verifique email e senha.");
      console.error(err);
    }
  };

  return (
    <div className="container login-container">
      <div className="card login-card">
        <h2 className="login-title">
          Acesso Restrito
        </h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* CAMPO EMAIL */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
            />
          </div>

          {/* CAMPO SENHA */}
          <div>
            <label className="label">Senha</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-control login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-details login-submit-btn"
          >
            Entrar
          </button>
        </form>

        <div className="login-footer">
          <Link
            to="/recuperar-senha"
            className="login-forgot-link"
          >
            Esqueceu a senha?
          </Link>

          <div className="login-register-text">
            Não tem conta?
            <Link
              to="/cadastro"
              className="login-register-link"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
