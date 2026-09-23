import { useCallback, useEffect, useRef, useState } from 'react';
import { post, mensagemDeErro } from '../../lib/api';
import { ResultadoTentativaSchema } from '../../contracts';
import type { IniciarTentativaResposta, ResultadoTentativa } from '../../contracts';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

interface Props {
  prova: IniciarTentativaResposta;
  fimEm: number;
  aoFinalizar: (resultado: ResultadoTentativa) => void;
}

const formatar = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function ProvaSimulado({ prova, fimEm, aoFinalizar }: Props) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [restante, setRestante] = useState(prova.segundosRestantes);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const autoEnviado = useRef(false);

  const enviar = useCallback(async () => {
    if (enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      const corpo = {
        respostas: Object.entries(respostas).map(([questaoId, alternativa]) => ({ questaoId, alternativa })),
      };
      const resultado = await post(`/tentativas/${prova.tentativaId}/finalizar`, corpo, ResultadoTentativaSchema);
      aoFinalizar(resultado);
    } catch (e) {
      setErro(mensagemDeErro(e));
      setEnviando(false);
    }
  }, [enviando, respostas, prova.tentativaId, aoFinalizar]);

  // Relógio: só exibição. Quem decide o prazo é o servidor.
  useEffect(() => {
    const id = setInterval(
      () => setRestante(Math.max(0, Math.ceil((fimEm - Date.now()) / 1000))),
      1000,
    );
    return () => clearInterval(id);
  }, [fimEm]);

  // Tempo esgotado → envia automaticamente o que foi respondido (uma única vez)
  useEffect(() => {
    if (restante === 0 && !autoEnviado.current) {
      autoEnviado.current = true;
      void enviar();
    }
  }, [restante, enviar]);

  function finalizar() {
    const faltam = prova.questoes.length - Object.keys(respostas).length;
    if (faltam > 0 && !window.confirm(`Faltam ${faltam} questão(ões) sem resposta. Finalizar mesmo assim?`)) return;
    void enviar();
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-40 flex items-center justify-between rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
        <div>
          <p className="font-semibold text-slate-700">{prova.titulo}</p>
          <p className="text-sm text-slate-500">{Object.keys(respostas).length}/{prova.questoes.length} respondidas</p>
        </div>
        <p className={`font-mono text-2xl font-bold ${restante <= 60 ? 'text-red-600' : 'text-slate-700'}`}>
          {formatar(restante)}
        </p>
      </div>

      {prova.questoes.map((q, i) => (
        <Card key={q.id} titulo={`Questão ${i + 1}`} subtitulo={`${q.disciplina} · ${q.topico}`}>
          <p className="mb-4 text-slate-800">{q.enunciado}</p>
          <div className="space-y-2">
            {q.alternativas.map((a) => (
              <label
                key={a.letra}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  respostas[q.id] === a.letra ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={a.letra}
                  checked={respostas[q.id] === a.letra}
                  onChange={() => setRespostas((r) => ({ ...r, [q.id]: a.letra }))}
                  className="mt-1"
                />
                <span><strong>{a.letra})</strong> {a.texto}</span>
              </label>
            ))}
          </div>
        </Card>
      ))}

      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      <Button onClick={finalizar} disabled={enviando} className="w-full sm:w-auto">
        {enviando ? 'Enviando…' : 'Finalizar simulado'}
      </Button>
    </div>
  );
}