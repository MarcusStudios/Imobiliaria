// src/pages/Cadastro.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // <--- 1. Importando ícones

export const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // 2. Estados para controlar a visibilidade das senhas (separados)
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
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado.");
      } else {
        setError("Falha ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Estilo comum para o botão do olho
  const eyeButtonStyle: React.CSSProperties = {
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
  };

  return (
    <div className="container" style={{ padding: "4rem 0", maxWidth: "400px" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Criar Conta
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
              placeholder="seu@email.com" // Placeholder
              required
            />
          </div>

          {/* CAMPO SENHA */}
          <div>
            <label className="label">Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha forte" // Placeholder
                style={{ paddingRight: "40px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CAMPO CONFIRMAR SENHA */}
          <div>
            <label className="label">Confirmar Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-control"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repita a senha" // Placeholder
                style={{ paddingRight: "40px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeButtonStyle}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-details"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Criando..." : "Cadastrar"}
          </button>
        </form>

        <div
          style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}
        >
          Já tem uma conta?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};
