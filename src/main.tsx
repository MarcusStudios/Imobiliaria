import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <--- 1. IMPORTANTE: Importe isso
import './css/index.css';
import App from './App';
import { FavoritosProvider } from './contexts/FavoritosContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritosProvider>
      {/* 2. Envolva o App com o HashRouter */}
      <HashRouter> 
        <App />
      </HashRouter>
    </FavoritosProvider>
  </StrictMode>,
);