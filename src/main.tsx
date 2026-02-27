import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '../src/css/index.css';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { AuthProvider } from './contexts/AuthContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WhatsAppProvider>
        <FavoritosProvider>
          <ToastProvider>
            <HashRouter>
              <ScrollToTop />
              <App />
            </HashRouter>
          </ToastProvider>
        </FavoritosProvider>
      </WhatsAppProvider>
    </AuthProvider>
  </StrictMode>,
);