import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { mensagemAuth } from '../../lib/erros-auth';
import { NovaSenhaSchema } from '../../lib/senha';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function NovaSenha({ aoConcluir }: { aoConcluir: () => void }) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const v = NovaSenhaSchema.safeParse({ senha, confirmacao });
    if (!v.success) {
      setErro(v.error.issues[0].message);
      return;
    }
    setErro(null);
    setSalvando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: v.data.senha });
      if (error) setErro(mensagemAuth(error));
      else aoConcluir();
    } catch {
      setErro('Sem conexão. Verifique a internet e tente de novo.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card titulo="Defina uma nova senha" destaque>
        <form onSubmit={salvar} className="flex flex-col gap-4">
          <Campo
            rotulo="Nova senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Campo
            rotulo="Confirme a nova senha"
            type="password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />
          {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
          <Button type="submit" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar nova senha'}
          </Button>
        </form>
      </Card>
    </div>
  );
}