import { useEffect, useState } from 'react';
import { get, post, mensagemDeErro } from '../../lib/api';
import { IniciarTentativaRespostaSchema, ListaSimuladosSchema } from '../../contracts';
import type { IniciarTentativaResposta, SimuladoResumo } from '../../contracts';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';
import { fimDaTentativa } from '../../lib/tempo';

interface Props {
  aoIniciar: (prova: IniciarTentativaResposta, fimEm: number) => void;
}

export function ListaSimulados({ aoIniciar }: Props) {
  const [simulados, setSimulados] = useState<SimuladoResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState<string | null>(null);
  
  useEffect(() => {
    get('/simulados', ListaSimuladosSchema)
      .then(setSimulados)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  async function iniciar(id: string) {
    setIniciando(id);
    setErro(null);
    try {
      const prova = await post(`/simulados/${id}/tentativas`, {}, IniciarTentativaRespostaSchema);
      // AQUI ESTÁ A CORREÇÃO: Usando a função pura em vez de Date.now()
      aoIniciar(prova, fimDaTentativa(prova.segundosRestantes));
    } catch (e) {
      setErro(mensagemDeErro(e));
      setIniciando(null);
    }
  }

  return (
    <Card titulo="Simulados disponíveis" subtitulo="O tempo começa a contar assim que você iniciar." destaque>
      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      {simulados === null && !erro && <p className="text-slate-400">Carregando…</p>}
      {simulados?.length === 0 && <p className="text-slate-400">Nenhum simulado publicado.</p>}
      <ul className="divide-y divide-slate-100">
        {simulados?.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium text-slate-800">{s.titulo}</p>
              <p className="text-sm text-slate-500">{s.totalQuestoes} questões · {s.duracaoMin} min</p>
            </div>
            <Button onClick={() => iniciar(s.id)} disabled={iniciando !== null}>
              {iniciando === s.id ? 'Iniciando…' : 'Iniciar / Retomar'}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}