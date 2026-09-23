import type { ReactNode } from 'react';

const tons = {
  verde: 'bg-green-50 text-green-700 ring-green-600/20',
  vermelho: 'bg-red-50 text-red-700 ring-red-600/10',
  cinza: 'bg-slate-100 text-slate-600 ring-slate-500/10',
};

export function Badge({ tom, children }: { tom: keyof typeof tons; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tons[tom]}`}>
      {children}
    </span>
  );
}