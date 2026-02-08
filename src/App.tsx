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
  Instagram,
} from "lucide-react";
import "./css/App.css";

// --- IMPORTS DE PÁGINAS ---

import { Home } from "./pages/Home";

import { WhatsAppButton } from "./components/WhatsAppButton";
// Imports com Lazy Loading (Carregamento sob demanda)
const Admin = lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.Admin })),
);
const Detalhes = lazy(() =>
  import("./pages/Detalhes").then((module) => ({ default: module.Detalhes })),
);

const Perfil = lazy(() =>
  import("./pages/Perfil").then((module) => ({ default: module.Perfil })),
);

const Favoritos = lazy(() =>
  import("./pages/Favoritos").then((module) => ({ default: module.Favoritos })),
);

const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Cadastro = lazy(() =>
  import("./pages/Cadastro").then((module) => ({ default: module.Cadastro })),
);
const RecuperarSenha = lazy(() =>
  import("./pages/RecuperarSenha").then((module) => ({
    default: module.RecuperarSenha,
  })),
);

// Import do Formulário de Cadastro/Edição
const CadastroImovel = lazy(() =>
  import("./pages/CadastroImovel").then((module) => ({
    default: module.CadastroImovel,
  })),
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

            <Link to="/perfil" className="nav-link" onClick={closeMenu}>
              Perfil
              {user && <User size={18} />}
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
          <Route path="/perfil" element={<Perfil />} />
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
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Seu parceiro confiável no mercado imobiliário. V2.1
            </p>
          </div>

          <div>
            <h4 style={{ color: "white", marginBottom: "1.5rem" }}>
              Fale Conosco
            </h4>

            {/* 1. WhatsApp (Primeiro) */}
            <a
              href="https://wa.me/5599991243054"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                color: "white" /* Começa branco */,
                transition: "color 0.3s ease",
                fontWeight: "500",
              }}
              /* Efeito Hover: Fica verde ao passar o mouse */
              onMouseOver={(e) => (e.currentTarget.style.color = "#25D366")}
              onMouseOut={(e) => (e.currentTarget.style.color = "white")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#25D366"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              (99) 99124-3054
            </a>

            {/* 2. Instagram (Segundo) */}
            <a
              href="https://www.instagram.com/moriaimoveis10/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                color: "white" /* Começa branco */,
                transition: "color 0.3s ease",
                fontWeight: "500",
              }}
              /* Efeito Hover: Fica rosa ao passar o mouse */
              onMouseOver={(e) => (e.currentTarget.style.color = "#E1306C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "white")}
            >
              <Instagram size={24} color="#E1306C" />
              @moriaimoveis10
            </a>

            {/* 3. Email (Último - Texto Simples) */}
            <div
              style={{
                marginTop: "1.5rem",
                borderTop: "1px solid #334155",
                paddingTop: "1rem",
              }}
            >
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                ✉️ moriaimoveis.atendimento@gmail.com.br
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ color: "white", marginBottom: "1rem" }}>Segurança</h4>
            <p>CRECI-MA: 922-J</p>
            <p>CRECI-MA: F4632</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
              © 2026 Lidiany Lopes Corretora.
              <br />
              Todos os direitos reservados.
            </p>

            <p
              className="texto-arco-iris"
              style={{
                marginTop: "0.7rem",
                fontSize: "0.8rem",
                
              }}
            >
              Desenvolvido por marcuseduardo846@gmail.com
            </p>
          </div>
        </div>
        <WhatsAppButton />
      </footer>
    </div>
  );
}

export default App;
