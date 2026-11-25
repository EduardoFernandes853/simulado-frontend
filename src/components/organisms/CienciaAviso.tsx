import { useState } from 'react';
import { mensagemDeErro, post } from '../../lib/api';
import { AlunoSchema, VERSAO_AVISO } from '../../contracts';
import type { Aluno } from '../../contracts';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';
import { AvisoPrivacidade } from './AvisoPrivacidade';

export function CienciaAviso({ aoConfirmar }: { aoConfirmar: (aluno: Aluno) => void }) {
  const [ciente, setCiente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function confirmar() {
    setEnviando(true);
    setErro(null);
    try {
      aoConfirmar(await post('/me/ciencia', { versao: VERSAO_AVISO }, AlunoSchema));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-6">
      <AvisoPrivacidade />
      <Card>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={ciente}
            onChange={(e) => setCiente(e.target.checked)}
          />
          Li o aviso de privacidade e estou ciente de como meus dados são tratados.
        </label>
        {erro && (
          <div className="mt-4">
            <Mensagem tipo="erro">{erro}</Mensagem>
          </div>
        )}
        <div className="mt-4">
          <Button disabled={!ciente || enviando} onClick={confirmar}>Continuar</Button>
        </div>
      </Card>
    </div>
  );
}