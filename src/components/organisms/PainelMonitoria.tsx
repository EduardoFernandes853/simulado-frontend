import { useCallback, useEffect, useState } from 'react';
import { api, get, mensagemDeErro } from '../../lib/api';
import { ListaAlertasSchema } from '../../contracts';
import type { AlertaMonitoria } from '../../contracts';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function PainelMonitoria() {
  const [alertas, setAlertas] = useState<AlertaMonitoria[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    get('/monitoria/alertas?status=PENDENTE', ListaAlertasSchema)
      .then(setAlertas)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function atender(id: string) {
    try {
      await api.patch(`/monitoria/alertas/${id}/atender`);
      carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  return (
    <Card
      titulo="Alertas de monitoria"
      subtitulo="Alunos abaixo do limiar, aguardando encaminhamento."
      acoes={<Button variant="secondary" onClick={carregar}>Atualizar</Button>}
      destaque
    >
      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      {alertas?.length === 0 && <p className="text-slate-400">Nenhum alerta pendente.</p>}
      <ul className="divide-y divide-slate-100">
        {alertas?.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium text-slate-800">{a.aluno.nome} <span className="font-mono text-xs text-slate-400">{a.aluno.matricula}</span></p>
              <p className="text-sm text-slate-500">{a.simulado} · nota {a.nota.toFixed(1)} (limiar {a.limiar}) · {new Date(a.criadoEm).toLocaleString('pt-BR')}</p>
            </div>
            <Button onClick={() => atender(a.id)}>Marcar como atendido</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}