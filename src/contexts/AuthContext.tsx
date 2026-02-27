// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth } from '../services/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged, 
  type User,
  type UserCredential // <--- 1. IMPORTANTE: Adicionamos a importação do tipo
} from 'firebase/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  // 2. CORREÇÃO: Mudamos de Promise<void> para Promise<UserCredential>
  login: (email: string, pass: string) => Promise<UserCredential>;
  register: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Email do administrador
// UID do administrador (deve estar no .env)
const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

if (!ADMIN_UID) {
  console.warn("ATENÇÃO: VITE_ADMIN_UID não definido no arquivo .env. As funcionalidades de admin não funcionarão.");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // As funções do Firebase retornam automaticamente o UserCredential, 
  // agora a interface aceita isso.
  const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  
  const register = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
  
  const logout = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      resetPassword,
      isAdmin: user?.uid === ADMIN_UID 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}