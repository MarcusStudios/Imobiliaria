import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  LogOut,
  User,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useAuth } from "../contexts/AuthContext";
import "../css/App.css"; // Ensure styles are available

export const Header = () => {
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
