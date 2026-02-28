// src/components/ErrorBoundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary: captura erros de renderização e exibe uma UI de fallback
 * em vez de deixar o app inteiro quebrar (útil para lazy-loaded pages).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
            minHeight: '40vh',
            color: '#64748b',
          }}
        >
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>
            Ocorreu um erro inesperado
          </h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
            Esta página não pôde ser carregada. Por favor, tente novamente.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--primary, #1a3c5e)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
