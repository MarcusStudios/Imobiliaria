/* eslint-disable react-refresh/only-export-components */
// src/contexts/ToastContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colors: Record<ToastType, { bg: string; border: string; color: string }> = {
    success: { bg: '#f0fdf4', border: '#22c55e', color: '#15803d' },
    error:   { bg: '#fef2f2', border: '#ef4444', color: '#dc2626' },
    warning: { bg: '#fffbeb', border: '#f59e0b', color: '#d97706' },
    info:    { bg: '#eff6ff', border: '#3b82f6', color: '#2563eb' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: '100%',
        }}
      >
        {toasts.map((toast) => {
          const c = colors[toast.type];
          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderLeft: `4px solid ${c.border}`,
                borderRadius: '10px',
                padding: '14px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                animation: 'toast-in 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => removeToast(toast.id)}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icons[toast.type]}</span>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', flex: 1, lineHeight: 1.5 }}>
                {toast.message}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
