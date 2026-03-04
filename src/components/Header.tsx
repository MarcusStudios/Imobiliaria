import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useFavoritos } from "../contexts/FavoritosContext";
import { WHATSAPP_URL } from "../constants";
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

  // Fechar menu mobile com Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isMenuOpen]);

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
              <span className="logo-creci">CRECI-MA F4632 | 922-J</span>
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
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
              WhatsApp
            </a>
          </div>

          {/* Botão Menu Mobile (Hamburguer) */}
          <button
            className="btn-mobile-toggle"
            onClick={openMenu}
            aria-label="Abrir Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobileMenu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

        </div>
      </header>

      {/* MENU MOBILE (OVERLAY) */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
        id="mobileMenu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
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

        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mobile-btn-whatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
          Falar no WhatsApp
        </a>
      </div>
    </>
  );
};

