import { useEffect, useState } from 'react';
import { get, mensagemDeErro } from '../../lib/api';
import { RevisaoSchema } from '../../contracts';
import type { Revisao } from '../../contracts';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

interface Props {
  tentativaId: string;
  aoVoltar: () => void;
}

function estiloDaAlternativa(correta: boolean, errada: boolean): string {
  if (correta) return 'border-green-600 bg-green-50';
  if (errada) return 'border-red-500 bg-red-50';
  return 'border-slate-200';
}

export function RevisaoProva({ tentativaId, aoVoltar }: Props) {
  const [revisao, setRevisao] = useState<Revisao | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true; // ignora a resposta se o componente sair da tela antes
    get(`/tentativas/${tentativaId}/revisao`, RevisaoSchema)
      .then((dados) => { if (ativo) setRevisao(dados); })
      .catch((e) => { if (ativo) setErro(mensagemDeErro(e)); });
    return () => { ativo = false; };
  }, [tentativaId]);

  if (erro) {
    return (
      <div className="space-y-4">
        <Mensagem tipo="erro">{erro}</Mensagem>
        <Button onClick={aoVoltar}>Voltar</Button>
      </div>
    );
  }

  if (!revisao) return <p className="text-slate-400">Carregando…</p>;

  const acertos = revisao.questoes.filter((q) => q.acertou).length;

  return (
    <div className="space-y-6">
      <Card
        titulo={revisao.simulado}
        subtitulo={`Revisão · ${acertos} de ${revisao.questoes.length} corretas · nota ${revisao.nota.toFixed(1)}%`}
        destaque
        acoes={<Button variant="secondary" onClick={aoVoltar}>Voltar</Button>}
      >
        <p className="text-sm text-slate-500">Verde é a resposta correta. Vermelho é a sua, quando errada.</p>
      </Card>

      {revisao.questoes.map((q, i) => (
        <Card
          key={q.questaoId}
          titulo={`Questão ${i + 1}`}
          subtitulo={`${q.disciplina} · ${q.topico}`}
          acoes={
            q.escolhida === null ? (
              <Badge tom="cinza">Em branco</Badge>
            ) : q.acertou ? (
              <Badge tom="verde">Acertou</Badge>
            ) : (
              <Badge tom="vermelho">Errou</Badge>
            )
          }
        >
          <p className="mb-4 text-slate-800">{q.enunciado}</p>

          <ul className="space-y-2">
            {q.alternativas.map((a) => {
              const correta = a.letra === q.correta;
              const errada = a.letra === q.escolhida && !correta;
              return (
                <li key={a.letra} className={`rounded-lg border p-3 ${estiloDaAlternativa(correta, errada)}`}>
                  <strong>{a.letra})</strong> {a.texto}
                  {correta && <span className="ml-2 text-sm text-green-700">correta</span>}
                  {errada && <span className="ml-2 text-sm text-red-700">sua resposta</span>}
                </li>
              );
            })}
          </ul>

          {q.justificativa && (
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">{q.justificativa}</p>
          )}
        </Card>
      ))}
    </div>
  );
}