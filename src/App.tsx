// src/App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import "./css/App.css";

// Importação das Páginas Separadas
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Detalhes } from "./pages/Detalhes";
import { Favoritos } from "./pages/Favoritos";

// Hook de Favoritos
function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const saved = localStorage.getItem("imobireact_favs");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("imobireact_favs", JSON.stringify(novos));
      return novos;
    });
  };
  return { favoritos, toggleFavorito };
}

const Header = ({ favCount }: { favCount: number }) => (
  <header className="header">
    <div className="container header-content">
      <Link to="/" className="logo">
        <HomeIcon className="text-blue-500" /> ImobiSmart
      </Link>
      <nav>
        <Link to="/" className="nav-link">Imóveis</Link>
        <Link to="/favoritos" className="nav-link">
          Favoritos {favCount > 0 && <span className="fav-count">{favCount}</span>}
        </Link>
        <Link to="/admin" className="nav-link" style={{ color: "var(--primary)" }}>
          Painel Admin
        </Link>
      </nav>
    </div>
  </header>
);

function App() {
  const { favoritos, toggleFavorito } = useFavoritos();

  return (
    <Router>
      <div className="app">
        <Header favCount={favoritos.length} />
        <Routes>
          <Route path="/" element={<Home favoritos={favoritos} toggleFavorito={toggleFavorito} />} />
          <Route path="/imovel/:id" element={<Detalhes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favoritos" element={<Favoritos favoritosIds={favoritos} />} />
        </Routes>
        <footer className="footer" style={{ background: "white", padding: "2rem", marginTop: "auto", textAlign: "center" }}>
          <p>© 2025 ImobiSmart. Feito com React + Firebase.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;