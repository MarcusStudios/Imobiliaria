// src/App.tsx
import { Suspense, lazy, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  Home as HomeIcon,
  LogOut,
  User,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import "./css/App.css";

// --- IMPORTS DE PÁGINAS ---

import { Home } from "./pages/Home";

// Imports com Lazy Loading (Carregamento sob demanda)
const Admin = lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.Admin }))
);
const Detalhes = lazy(() =>
  import("./pages/Detalhes").then((module) => ({ default: module.Detalhes }))
);
const Favoritos = lazy(() =>
  import("./pages/Favoritos").then((module) => ({ default: module.Favoritos }))
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login }))
);
const Cadastro = lazy(() =>
  import("./pages/Cadastro").then((module) => ({ default: module.Cadastro }))
);
const RecuperarSenha = lazy(() =>
  import("./pages/RecuperarSenha").then((module) => ({
    default: module.RecuperarSenha,
  }))
);

// Import do Formulário de Cadastro/Edição
const CadastroImovel = lazy(() =>
  import("./pages/CadastroImovel").then((module) => ({
    default: module.CadastroImovel,
  }))
);

// Hooks
import { useFavoritos } from "./contexts/FavoritosContext";
import { useAuth } from "./contexts/AuthContext";
import { RotaPrivada } from "./components/RotaPrivada";

// Componente de Loading
const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      padding: "4rem",
      color: "#64748b",
    }}
  >
    <p>Carregando...</p>
  </div>
);

const Header = () => {
  const { count } = useFavoritos();
  const { user, logout, isAdmin } = useAuth();

  // Controle do Menu Mobile e Modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    closeMenu();
  };

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <HomeIcon className="text-blue-500" /> Lidiany Lopes
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Imóveis
            </Link>

            <Link to="/favoritos" className="nav-link" onClick={closeMenu}>
              Favoritos{" "}
              {count > 0 && <span className="fav-count">{count}</span>}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="nav-link"
                onClick={closeMenu}
                style={{ color: "var(--primary)", fontWeight: "bold" }}
              >
                Painel Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="nav-link btn-logout"
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
                onClick={closeMenu}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <User size={18} /> Entrar
              </Link>
            )}
          </nav>

          {isMenuOpen && (
            <div className="menu-overlay" onClick={closeMenu}></div>
          )}
        </div>
      </header>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">
              <AlertTriangle size={40} color="#ef4444" />
            </div>
            <h3>Tem certeza?</h3>
            <p>Você será desconectado da sua conta.</p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleConfirmLogout}>
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <div className="app">
      <Header />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imovel/:id" element={<Detalhes />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

          {/* ROTAS PROTEGIDAS DO ADMIN */}
          <Route
            path="/admin"
            element={
              <RotaPrivada>
                <Admin />
              </RotaPrivada>
            }
          />

          {/* Rota para CRIAR novo imóvel */}
          <Route
            path="/cadastro-imovel"
            element={
              <RotaPrivada>
                <CadastroImovel />
              </RotaPrivada>
            }
          />

          {/* Rota para EDITAR imóvel existente (usa o mesmo form) */}
          <Route
            path="/editar/:id"
            element={
              <RotaPrivada>
                <CadastroImovel />
              </RotaPrivada>
            }
          />
        </Routes>
      </Suspense>

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
              <HomeIcon /> Lidiany Lopes Corretora
            </h3>
            <p style={{ fontSize: "0.9rem" }}>
              Realizando sonhos e conectando pessoas aos seus lares ideais em
              Açailândia e Região.
            </p>
          </div>

          <div>
            <h4 style={{ color: "white", marginBottom: "1rem" }}>
              Fale Conosco
            </h4>
            <p style={{ marginBottom: "0.5rem" }}>
              📍 Rua Exemplo, 123 - Centro
            </p>
            <p style={{ marginBottom: "0.5rem" }}>📞 (99) 99124-3054</p>
            <p>✉️ moriaimoveis.atendimento@gmail.com.br</p>
          </div>

          <div>
            <h4 style={{ color: "white", marginBottom: "1rem" }}>Segurança</h4>
            <p>CRECI-MA: F4632</p>
            <p>CRECI-MA: 922-J</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
              © 2026 Lidiany Lopes Corretora.
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
