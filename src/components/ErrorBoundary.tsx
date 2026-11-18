import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props { 
  children: ReactNode; 
  aoRecarregar?: () => void 
}

interface Estado { 
  falhou: boolean 
}

export class ErrorBoundary extends Component<Props, Estado> {
  state: Estado = { falhou: false };

  static getDerivedStateFromError(): Estado { 
    return { falhou: true }; 
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Falha de renderização:', erro, info.componentStack);
  }

  render() {
    if (!this.state.falhou) return this.props.children;
    
    const recarregar = this.props.aoRecarregar ?? (() => window.location.reload());
    
    return (
      <div role="alert" className="mx-auto max-w-md p-8 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-800">Algo deu errado.</p>
        <p className="mb-6 text-sm text-slate-600">
          Se você estava em uma prova, suas respostas ficam salvas neste aparelho. Recarregue para continuar.
        </p>
        <button type="button" className="rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800" onClick={recarregar}>
          Recarregar
        </button>
      </div>
    );
  }
}