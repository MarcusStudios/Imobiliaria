import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useFavoritos } from "../contexts/FavoritosContext";
import "../css/App.css";

export const Header = () => {
  const { count } = useFavoritos();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* CABEÇALHO PRINCIPAL */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="mainHeader">
        <div className="container">
            
          {/* Logótipo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <svg className="logo-icon" viewBox="0 0 120 60">
              <path d="M10 50 L60 10 L110 50" />
              <path d="M35 50 L60 30 L85 50" />
            </svg>
            <div className="logo-text-container">
              <span className="logo-title">Lidiany Lopes</span>
              <span className="logo-subtitle">Corretora & Moriá Imóveis</span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="nav-desktop">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Início</Link>
            <Link to="/" state={{ filtroTipo: 'comprar' }} className="nav-link">Comprar</Link>
            <Link to="/sobre-nos" className={`nav-link ${location.pathname === '/sobre-nos' ? 'active' : ''}`} onClick={closeMenu}>Sobre Nós</Link>
            <Link to="/favoritos" className={`nav-link ${location.pathname === '/favoritos' ? 'active' : ''}`}>
              Favoritos {count > 0 && <span className="fav-count">{count}</span>}
            </Link>
            <Link to="/perfil" className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`} aria-label="Perfil">
              <User size={24} />
            </Link>
          </nav>

          {/* Contacto Desktop */}
          <div className="contact-desktop">
            <div className="contact-info">
              <p className="contact-label">Atendimento Exclusivo</p>
              <p className="contact-number">(99) 99124-3054</p>
            </div>
            <a href="https://wa.me/5599991243054" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              WhatsApp
            </a>
          </div>

          {/* Botão Menu Mobile (Hamburguer) */}
          <button className="btn-mobile-toggle" onClick={openMenu} aria-label="Abrir Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

        </div>
      </header>

      {/* MENU MOBILE (OVERLAY) */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} id="mobileMenu">
        {/* Botão Fechar Menu */}
        <button className="btn-mobile-close" onClick={closeMenu} aria-label="Fechar Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <Link to="/" className="mobile-link" onClick={closeMenu}>Início</Link>
        <Link to="/" className="mobile-link" onClick={closeMenu}>Comprar</Link>
        <Link to="/sobre-nos" className="mobile-link" onClick={closeMenu}>Sobre Nós</Link>
        <Link to="/favoritos" className="mobile-link" onClick={closeMenu}>
          <span>Favoritos</span>
          {count > 0 && <span className="fav-count">{count}</span>}
        </Link>
        <Link to="/perfil" className="mobile-link" onClick={closeMenu}>
          <span>Perfil</span>
          <User size={24} />
        </Link>

        <a href="https://wa.me/5599991243054" target="_blank" rel="noopener noreferrer" className="mobile-btn-whatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          Falar no WhatsApp
        </a>
      </div>
    </>
  );
};

