// src/components/ConfirmModal.tsx
import { useEffect, useRef } from 'react';
import '../css/ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Fechar com Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Focus no botão cancelar ao abrir (mais seguro por padrão)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Focus trap: Tab/Shift+Tab fica entre os 2 botões
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusable = [cancelBtnRef.current, confirmBtnRef.current].filter(Boolean) as HTMLElement[];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      onKeyDown={handleKeyDown}
    >
      <div className={`confirm-card confirm-card--${variant}`}>
        <div className="confirm-icon">
          {variant === 'danger' ? '🗑️' : '⚠️'}
        </div>

        <h2 className="confirm-title" id="confirm-title">{title}</h2>
        <p className="confirm-message" id="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            ref={cancelBtnRef}
            className="confirm-btn confirm-btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            className={`confirm-btn confirm-btn--${variant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
