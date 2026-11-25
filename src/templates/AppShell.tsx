import type { ReactNode } from 'react';
import { Button } from '../components/atoms/Button';
import { StatusSistema } from '../components/molecules/StatusSistema';

interface AppShellProps {
  children: ReactNode;
  usuario?: { nome: string; papel: string } | null;
  aoAbrirConta?: () => void;
  aoSair?: () => void;
}

export function AppShell({ children, usuario, aoAbrirConta, aoSair }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-8">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">IFPA | Simulado Digital</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Campus Tucuruí</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusSistema />
          {usuario && <span className="hidden text-sm text-slate-600 sm:inline">{usuario.nome}</span>}
          {usuario && aoAbrirConta && <Button variant="secondary" onClick={aoAbrirConta}>Minha conta</Button>}
          {aoSair && <Button variant="secondary" onClick={aoSair}>Sair</Button>}
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
    </div>
  );
}