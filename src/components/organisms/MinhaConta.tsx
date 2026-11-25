import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, mensagemDeErro } from '../../lib/api';
import { baixarArquivo } from '../../lib/download';
import { AlunoSchema, AtualizarPerfilBodySchema } from '../../contracts';
import type { Aluno } from '../../contracts';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

interface Props {
  aluno: Aluno;
  aoAtualizar: (aluno: Aluno) => void;
  aoVoltar: () => void;
  aoVerAviso: () => void;
  aoExcluir: () => void;
}

type Aviso = { tipo: 'sucesso' | 'erro'; texto: string };

export function MinhaConta({ aluno, aoAtualizar, aoVoltar, aoVerAviso, aoExcluir }: Props) {
  const [nome, setNome] = useState(aluno.nome);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [confirmacao, setConfirmacao] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function salvarNome(e: FormEvent) {
    e.preventDefault();
    const v = AtualizarPerfilBodySchema.safeParse({ nome });
    if (!v.success) {
      setAviso({ tipo: 'erro', texto: v.error.issues[0].message });
      return;
    }
    setOcupado(true);
    try {
      const { data } = await api.patch('/me', v.data);
      aoAtualizar(AlunoSchema.parse(data));
      setAviso({ tipo: 'sucesso', texto: 'Nome atualizado.' });
    } catch (falha) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(falha) });
    } finally {
      setOcupado(false);
    }
  }

  async function baixarDados() {
    setOcupado(true);
    try {
      const { data } = await api.get('/me/dados', { responseType: 'blob' });
      baixarArquivo(data as Blob, 'meus-dados.json');
      setAviso(null);
    } catch (falha) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(falha) });
    } finally {
      setOcupado(false);
    }
  }

  async function excluirConta() {
    setOcupado(true);
    try {
      await api.delete('/me', { data: { confirmacao: 'EXCLUIR' } });
      aoExcluir();
    } catch (falha) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(falha) });
      setOcupado(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card titulo="Minha conta" destaque acoes={<Button variant="secondary" onClick={aoVoltar}>Voltar</Button>}>
        <dl className="mb-4 space-y-1 text-sm text-slate-600">
          <div>
            <dt className="inline font-medium">Matrícula: </dt>
            <dd className="inline">{aluno.matricula}</dd>
          </div>
          <div>
            <dt className="inline font-medium">E-mail: </dt>
            <dd className="inline">{aluno.email}</dd>
          </div>
        </dl>
        <form onSubmit={salvarNome} className="flex flex-col gap-3">
          <Campo rotulo="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div>
            <Button type="submit" disabled={ocupado}>Salvar nome</Button>
          </div>
        </form>
        {aviso && (
          <div className="mt-4">
            <Mensagem tipo={aviso.tipo}>{aviso.texto}</Mensagem>
          </div>
        )}
      </Card>

      <Card titulo="Seus dados" subtitulo="Você pode ver tudo o que o sistema guarda sobre você.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" disabled={ocupado} onClick={baixarDados}>Baixar meus dados</Button>
          <Button variant="secondary" onClick={aoVerAviso}>Ver aviso de privacidade</Button>
        </div>
      </Card>

      <Card titulo="Excluir conta">
        {aluno.papel === 'ALUNO' ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Apaga seus resultados e alertas e encerra seu login. Não dá para desfazer. Para voltar a usar o sistema, será preciso pedir um novo convite.
            </p>
            <Campo
              rotulo="Digite EXCLUIR para confirmar"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
            <Button variant="danger" disabled={confirmacao !== 'EXCLUIR' || ocupado} onClick={excluirConta}>
              Excluir minha conta
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-600">Contas de professor são removidas pela coordenação do projeto.</p>
        )}
      </Card>
    </div>
  );
}