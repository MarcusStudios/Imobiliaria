// src/pages/Cadastro.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import '../css/Cadastro.css';

export const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPass) {
      return setError("As senhas não coincidem.");
    }

    if (password.length < 6) {
      return setError("A senha deve ter pelo menos 6 caracteres.");
    }

    try {
      setError("");
      setLoading(true);
      await register(email, password);
      navigate("/");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado.");
      } else {
        setError("Falha ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container cadastro-container">
      <div className="card cadastro-card">
        <h2 className="cadastro-title">
          Criar Conta
        </h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form">
          {/* CAMPO EMAIL */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* CAMPO SENHA */}
          <div>
            <label className="label">Senha</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-control input-control-with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha forte"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CAMPO CONFIRMAR SENHA */}
          <div>
            <label className="label">Confirmar Senha</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-control input-control-with-icon"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repita a senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-button"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-details btn-submit"
            disabled={loading}
          >
            {loading ? "Criando..." : "Cadastrar"}
          </button>
        </form>

        <div className="login-link-wrapper">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="login-link"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};
