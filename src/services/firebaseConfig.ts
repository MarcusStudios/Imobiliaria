// services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVNWYvqyJKiaCenzLcQjFyo_rqIfyBUBo",
  authDomain: "imobiliaria-c4931.firebaseapp.com",
  projectId: "imobiliaria-c4931",
  storageBucket: "imobiliaria-c4931.firebasestorage.app",
  messagingSenderId: "906464003490",
  appId: "1:906464003490:web:4e15cedd7fab1cd4159efb",
  measurementId: "G-M6XMQ9H6ZM"
};

// Validação simples para garantir que as variáveis de ambiente existam
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(key => {
  if (!import.meta.env[key]) {
     console.error(`ERRO CRÍTICO: Variável de ambiente ${key} não encontrada! Verifique seu arquivo .env.`);
  }
});

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas para usar no resto do site
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
