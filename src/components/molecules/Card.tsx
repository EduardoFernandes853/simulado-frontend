import type { ReactNode } from 'react';

interface CardProps {
  titulo?: string;
  subtitulo?: string;
  acoes?: ReactNode;
  destaque?: boolean;
  children: ReactNode;
}

export function Card({ titulo, subtitulo, acoes, destaque = false, children }: CardProps) {
  return (
    <section className={`rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6 ${destaque ? 'border-t-4 border-t-green-700' : ''}`}>
      {(titulo || acoes) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {titulo && <h2 className="text-xl font-semibold text-slate-700">{titulo}</h2>}
            {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
          </div>
          {acoes}
        </header>
      )}
      {children}
    </section>
  );
}