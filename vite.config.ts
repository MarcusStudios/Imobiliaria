/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Imobiliaria/",
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  
  // ADICIONE ESSA PARTE DO BUILD:
  build: {
    chunkSizeWarningLimit: 1000, // Aumenta o limite do aviso
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa as bibliotecas pesadas do seu código principal
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          icons: ['lucide-react']
        }
      }
    }
  }
})