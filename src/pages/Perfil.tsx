// src/pages/Perfil.tsx
import { useAuth } from "../contexts/AuthContext";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Heart, LogOut, Shield } from "lucide-react";

export const Perfil = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useFavoritos();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = window.confirm("Deseja realmente sair da conta?");
    if (confirm) {
      await logout();
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
        <h2>Você não está logado.</h2>
        <button className="btn-details" onClick={() => navigate("/login")}>
          Ir para Login
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1rem", maxWidth: "600px" }}>
      <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Minha Conta</h1>

      <div className="card" style={{ padding: "2rem", textAlign: "center", borderTop: "5px solid var(--primary)" }}>
        
        {/* FOTO DO USUÁRIO */}
        <div 
          style={{
            width: "100px",
            height: "100px",
            background: "#eff6ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            border: "4px solid white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Foto de perfil" 
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
            />
          ) : (
            <User size={48} color="var(--primary)" />
          )}
        </div>

        {/* NOME E EMAIL */}
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          {user.displayName || "Usuário sem nome"}
        </h2>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--secondary)", marginBottom: "2rem" }}>
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        {isAdmin && (
           <div style={{ background: "#dcfce7", color: "#166534", padding: "0.5rem", borderRadius: "8px", marginBottom: "1.5rem", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: "bold" }}>
             <Shield size={16} /> Conta de Administrador
           </div>
        )}

        <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "1.5rem 0" }} />

        {/* ESTATÍSTICAS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div 
            onClick={() => navigate("/favoritos")}
            style={{ 
              background: "#f8fafc", 
              padding: "1rem", 
              borderRadius: "12px", 
              cursor: "pointer", 
              border: "1px solid #e2e8f0",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
            onMouseOut={(e) => e.currentTarget.style.background = "#f8fafc"}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#ef4444", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Heart fill="#ef4444" /> {count}
            </div>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>Imóveis Favoritos</p>
          </div>
        </div>

        {/* BOTÃO SAIR */}
        <button 
          onClick={handleLogout}
          style={{
            background: "#fee2e2",
            color: "#ef4444",
            border: "none",
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          <LogOut size={20} /> Sair da Conta
        </button>

      </div>
    </div>
  );
};