// src/App.tsx
import { Routes, Route, Link } from "react-router-dom"; // <--- REMOVIDO 'BrowserRouter as Router'
import { Home as HomeIcon, LogOut, User } from "lucide-react";
// Se o seu CSS estiver em src/css/App.css mantenha assim, se não, ajuste para './App.css' ou './index.css'
import "./css/App.css"; 

// Páginas
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Detalhes } from "./pages/Detalhes";
import { Favoritos } from "./pages/Favoritos";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { RecuperarSenha } from "./pages/RecuperarSenha";

// Hooks
import { useFavoritos } from "./contexts/FavoritosContext";
import { useAuth } from "./contexts/AuthContext";
import { RotaPrivada } from "./components/RotaPrivada";

const Header = () => {
  const { count } = useFavoritos();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <HomeIcon className="text-blue-500" /> Lidiane Corretora
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" className="nav-link">Imóveis</Link>
          <Link to="/favoritos" className="nav-link">
            Favoritos {count > 0 && <span className="fav-count">{count}</span>}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="nav-link"
              style={{ color: "var(--primary)", fontWeight: "bold" }}
            >
              Painel Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="nav-link"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <LogOut size={18} /> Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="nav-link"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <User size={18} /> Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

function App() {
  return (
    // REMOVIDO: <AuthProvider>, <FavoritosProvider> e <Router> 
    // (Eles já estão no main.tsx)
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imovel/:id" element={<Detalhes />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route
          path="/admin"
          element={
            <RotaPrivada>
              <Admin />
            </RotaPrivada>
          }
        />
        <Route
          path="/admin/:id"
          element={
            <RotaPrivada>
              <Admin />
            </RotaPrivada>
          }
        />
      </Routes>
      
      <footer
        style={{
          background: "#1e293b",
          color: "#94a3b8",
          padding: "3rem 1rem",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Coluna 1: Marca */}
          <div>
            <h3
              style={{
                color: "white",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <HomeIcon /> Lidiane Corretora
            </h3>
            <p style={{ fontSize: "0.9rem" }}>
              Realizando sonhos e conectando pessoas aos seus lares ideais
              em Primavera do Leste.
            </p>
          </div>

          {/* Coluna 2: Contato */}
          <div>
            <h4 style={{ color: "white", marginBottom: "1rem" }}>
              Fale Conosco
            </h4>
            <p style={{ marginBottom: "0.5rem" }}>
              📍 Rua Exemplo, 123 - Centro
            </p>
            <p style={{ marginBottom: "0.5rem" }}>📞 (66) 99999-9999</p>
            <p>✉️ contato@lidianecorretora.com.br</p>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h4 style={{ color: "white", marginBottom: "1rem" }}>
              Segurança
            </h4>
            <p>CRECI-MT: 12345-F</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
              © 2026 Lidiane Corretora.
              <br />
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;