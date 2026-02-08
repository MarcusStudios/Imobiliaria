import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '../src/css/index.css'; // <--- CONFIRA: Se o arquivo estiver em src/index.css, use assim.
import App from './App';
import ScrollToTop from './components/ScrollToTop'; // <--- Importe aqui
import { FavoritosProvider } from './contexts/FavoritosContext';
import { AuthProvider } from './contexts/AuthContext'; // <--- 1. ADICIONE ISSO

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. O AuthProvider tem que envolver tudo para o login funcionar */}
    <AuthProvider>
      <FavoritosProvider>
        <HashRouter> 
          <ScrollToTop />
          <App />
        </HashRouter>
      </FavoritosProvider>
    </AuthProvider>
  </StrictMode>,
);