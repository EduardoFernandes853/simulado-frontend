import { useCallback, useEffect, useState } from 'react';
import { get, mensagemDeErro } from '../../lib/api';
import { HistoricoSchema } from '../../contracts';
import type { HistoricoItem } from '../../contracts';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function HistoricoResultados({ aoRevisar }: { aoRevisar: (tentativaId: string) => void }) {
  const [itens, setItens] = useState<HistoricoItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    get('/tentativas/minhas', HistoricoSchema)
      .then(setItens)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <Card
      titulo="Meu histórico"
      subtitulo="Suas tentativas e o status de monitoria."
      acoes={<Button variant="secondary" onClick={carregar}>Atualizar</Button>}
    >
      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-green-100 bg-green-50/50 uppercase text-green-900">
            <tr>
              <th className="px-4 py-3">Simulado</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Nota</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {itens?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Nenhuma tentativa ainda.</td></tr>
            )}
            {itens?.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{i.simulado}</td>
                <td className="px-4 py-3">{i.finalizadaEm ? new Date(i.finalizadaEm).toLocaleString('pt-BR') : '—'}</td>
                <td className="px-4 py-3 font-semibold">{i.nota?.toFixed(1) ?? '—'}</td>
                <td className="px-4 py-3">
                  {i.alertaMonitoria ? <Badge tom="vermelho">Monitoria acionada</Badge> : <Badge tom="verde">Adequado</Badge>}
                </td>
                <td className="px-4 py-3">
                  <Button variant="secondary" onClick={() => aoRevisar(i.id)}>Revisar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}