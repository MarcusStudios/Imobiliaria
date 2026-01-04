// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css'; // ou ./index.css dependendo da sua estrutura
import App from './App';
import { FavoritosProvider } from './contexts/FavoritosContext'; // <--- Importe aqui

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritosProvider> {/* Envolva o App aqui */}
      <App />
    </FavoritosProvider>
  </StrictMode>,
);