// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // <--- 1. Importando os ícones

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. Estado para controlar se mostra ou esconde a senha
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
    <div className="container" style={{ padding: "4rem 0", maxWidth: "400px" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Acesso Restrito
        </h2>
        {error && (
          <div
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          {/* CAMPO EMAIL */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com" // <--- Placeholder adicionado
              required
            />
          </div>

          {/* CAMPO SENHA COM O OLHO */}
          <div>
            <label className="label">Senha</label>
            <div style={{ position: "relative" }}>
              {" "}
              {/* Necessário para posicionar o ícone */}
              <input
                // Alterna entre 'text' (visível) e 'password' (bolinhas)
                type={showPassword ? "text" : "password"}
                className="input-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha" // <--- Placeholder adicionado
                style={{ paddingRight: "40px" }} // Espaço para o texto não ficar embaixo do ícone
                required
              />
              <button
                type="button" // IMPORTANTE: type="button" para não enviar o formulário ao clicar
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-details"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Entrar
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.9rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          <Link
            to="/recuperar-senha"
            style={{ color: "#64748b", textDecoration: "none" }}
          >
            Esqueceu a senha?
          </Link>

          <div>
            Não tem conta?{" "}
            <Link
              to="/cadastro"
              style={{
                color: "var(--primary)",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
