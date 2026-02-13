// src/pages/Perfil.tsx
import { useAuth } from "../contexts/AuthContext";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Heart, LogOut, Shield } from "lucide-react";
import '../css/Perfil.css';

export const Perfil = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useFavoritos();
  const navigate = useNavigate();

  console.log("ola");

  const handleLogout = async () => {
    const confirm = window.confirm("Deseja realmente sair da conta?");
    if (confirm) {
      await logout();
      navigate("/");
    }
  };

  // --- ESTADO NÃO LOGADO (Redesign) ---
  if (!user) {
    return (
      <div className="login-redirect-container">
        <div className="login-card">
          <div className="login-icon-wrapper">
             <User size={40} />
          </div>
          <h2>Acesso Restrito</h2>
          <p style={{color: 'var(--secondary)', marginTop: '0.5rem'}}>
            Para acessar seu perfil e ver os imóveis favoritos, você precisa entrar na sua conta.
          </p>
          <button className="btn-primary-lg" onClick={() => navigate("/login")}>
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  // --- ESTADO LOGADO (Redesign) ---
  return (
    <div className="perfil-page">
      
      {/* 1. BANNER SUPERIOR */}
      <div className="perfil-header-bg"></div>

      <div className="perfil-container">
        <div className="perfil-card">
          
          {/* 2. CABEÇALHO DO PERFIL (Avatar + Nome) */}
          <div className="perfil-top-section">
            <div className="perfil-avatar-wrapper">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Foto de perfil" 
                  className="perfil-avatar-img"
                />
              ) : (
                <div className="perfil-avatar-placeholder">
                  <User size={64} />
                </div>
              )}
            </div>

            <h1 className="perfil-name">
              {user.displayName || "Usuário sem nome"}
            </h1>
            
            <div className="perfil-email">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>

            {isAdmin && (
              <div className="perfil-badge-admin">
                <Shield size={14} fill="currentColor" /> Administrador
              </div>
            )}
          </div>

          {/* 3. CONTEÚDO / AÇÕES */}
          <div className="perfil-content">
            <h3 className="perfil-section-title">
              Minhas Atividades
            </h3>

            <div className="perfil-grid">
              
              {/* Card Favoritos */}
              <div 
                onClick={() => navigate("/favoritos")}
                className="perfil-action-card"
              >
                <div className="perfil-action-icon icon-fav">
                  <Heart fill={count > 0 ? "#ef4444" : "none"} size={24} />
                </div>
                <div className="perfil-action-info">
                  <h3>Imóveis Favoritos</h3>
                  <p>
                    {count} {count === 1 ? "imóvel salvo" : "imóveis salvos"}
                  </p>
                </div>
              </div>

              {/* Card Configurações (exemplo futuro) */}
              

            </div>

             <div style={{borderTop: '1px solid #f1f5f9', margin: '1rem 0'}}></div>

            {/* BOTÃO SAIR */}
            <div className="btn-logout-container">
              <button 
                onClick={handleLogout}
                className="btn-logout"
              >
                <LogOut size={20} /> Sair da Conta
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};