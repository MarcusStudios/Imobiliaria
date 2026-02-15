// src/firebaseConfig.ts
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas para usar no resto do site
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
