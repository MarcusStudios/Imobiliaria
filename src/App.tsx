// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home as HomeIcon, LogOut, User } from "lucide-react";
import "./css/App.css";

// Páginas
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Detalhes } from "./pages/Detalhes";
import { Favoritos } from "./pages/Favoritos";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { RecuperarSenha } from "./pages/RecuperarSenha";

// Contextos e Componentes
import { FavoritosProvider, useFavoritos } from "./contexts/FavoritosContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RotaPrivada } from "./components/RotaPrivada";

const Header = () => {
  const { count } = useFavoritos();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="container header-content">
        {/* MUDANÇA AQUI: Nome da Corretora */}
        <Link to="/" className="logo">
          <HomeIcon className="text-blue-500" /> Lidiane Corretora
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="nav-link">Imóveis</Link>
          <Link to="/favoritos" className="nav-link">
            Favoritos {count > 0 && <span className="fav-count">{count}</span>}
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="nav-link" style={{ color: "var(--primary)", fontWeight: 'bold' }}>
              Painel Admin
            </Link>
          )}

          {user ? (
            <button onClick={logout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={18} /> Sair
            </button>
          ) : (
            <Link to="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
    <AuthProvider>
      <FavoritosProvider>
        <Router>
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
            </Routes>
            <footer className="footer" style={{ background: "white", padding: "2rem", marginTop: "auto", textAlign: "center" }}>
              <p>© 2026 Lidiane Corretora. Todos os direitos reservados.</p>
            </footer>
          </div>
        </Router>
      </FavoritosProvider>
    </AuthProvider>
  );
}

export default App;