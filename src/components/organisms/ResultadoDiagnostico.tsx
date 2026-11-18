import type { ResultadoTentativa } from '../../contracts';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';

interface Props {
  resultado: ResultadoTentativa;
  aoVoltar: () => void;
  aoRevisar: () => void;
}

export function ResultadoDiagnostico({ resultado, aoVoltar, aoRevisar }: Props) {
  return (
    <div className="space-y-6">
      <Card titulo="Resultado do simulado" destaque>
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-5xl font-bold text-slate-800">{resultado.nota.toFixed(1)}%</p>
          <div className="space-y-2">
            <p className="text-slate-600">{resultado.acertos} de {resultado.total} questões corretas</p>
            {resultado.alertaMonitoria ? (
              <Badge tom="vermelho">Monitoria acionada (limiar de {resultado.limiar}%)</Badge>
            ) : (
              <Badge tom="verde">Desempenho adequado</Badge>
            )}
          </div>
        </div>
      </Card>

      <Card titulo="Desempenho por tópico" subtitulo="Onde estão suas lacunas de nivelamento.">
        <ul className="space-y-4">
          {resultado.porTopico.map((t) => (
            <li key={`${t.disciplina}-${t.topico}`}>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>{t.disciplina} · {t.topico}</span>
                <span>{t.acertos}/{t.total} ({t.percentual}%)</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div
                  className={`h-2 rounded ${t.percentual >= resultado.limiar ? 'bg-green-600' : 'bg-red-500'}`}
                  style={{ width: `${t.percentual}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={aoRevisar}>Ver gabarito comentado</Button>
        <Button variant="secondary" onClick={aoVoltar}>Voltar ao início</Button>
      </div>
    </div>
  );
}