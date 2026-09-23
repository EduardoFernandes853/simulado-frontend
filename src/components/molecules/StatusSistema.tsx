import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export function StatusSistema() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let ativo = true;
    const checar = () => {
      api.get('/health', { timeout: 5000 })
        .then(() => { if (ativo) setOk(true); })
        .catch(() => { if (ativo) setOk(false); });
    };
    checar();
    const id = setInterval(checar, 30_000);
    return () => { ativo = false; clearInterval(id); };
  }, []);

  const cor = ok === null ? 'bg-slate-400' : ok ? 'bg-emerald-500' : 'bg-red-500';
  const texto = ok === null ? 'Verificando…' : ok ? 'Sistema operacional' : 'Servidor indisponível';

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${cor}`} />
      {texto}
    </div>
  );
}