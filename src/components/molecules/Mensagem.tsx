import type { ReactNode } from 'react';

const cores = {
  erro: 'bg-red-50 border-red-500 text-red-800',
  sucesso: 'bg-emerald-50 border-emerald-500 text-emerald-800',
  info: 'bg-slate-50 border-slate-400 text-slate-700',
};

export function Mensagem({ tipo, children }: { tipo: keyof typeof cores; children: ReactNode }) {
  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-lg border-l-4 p-3 text-sm ${cores[tipo]}`}>
      {children}
    </div>
  );
}