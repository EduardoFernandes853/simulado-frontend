import { VERSAO_AVISO } from '../../contracts';
import { AVISO_EM_REVISAO, SECOES_AVISO } from '../../content/avisoPrivacidade';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function AvisoPrivacidade({ aoVoltar }: { aoVoltar?: () => void }) {
  return (
    <Card
      titulo="Aviso de privacidade"
      subtitulo={`Versão ${VERSAO_AVISO}`}
      destaque
      acoes={aoVoltar && <Button variant="secondary" onClick={aoVoltar}>Voltar</Button>}
    >
      {AVISO_EM_REVISAO && (
        <Mensagem tipo="info">Este texto é um rascunho em revisão pelo encarregado de dados do IFPA.</Mensagem>
      )}
      <div className="mt-4 space-y-6">
        {SECOES_AVISO.map((s) => (
          <section key={s.titulo}>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">{s.titulo}</h3>
            {s.paragrafos.map((p) => (
              <p key={p} className="mb-2 text-sm text-slate-600">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </Card>
  );
}