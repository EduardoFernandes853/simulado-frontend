// src/templates/AppShell.tsx
import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header Fixo Institucional */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">IFPA | Simulado Digital</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Campus Tucuruí</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-emerald-700">Sistema Operacional</span>
        </div>
      </header>

      {/* Conteúdo Injetado Dinamicamente */}
      <main className="mx-auto max-w-6xl p-8">
        {children}
      </main>
    </div>
  );
}