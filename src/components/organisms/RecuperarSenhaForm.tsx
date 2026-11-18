import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { mensagemAuth } from '../../lib/erros-auth';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function RecuperarSenhaForm({ aoVoltar }: { aoVoltar: () => void }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin,
      });
      if (error) setErro(mensagemAuth(error));
      else setEnviado(true);
    } catch {
      setErro('Sem conexão. Verifique a internet e tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card titulo="Recuperar senha" destaque>
        {enviado ? (
          <div className="space-y-4">
            {/* Mesma mensagem exista ou não a conta: não revelamos quem está cadastrado */}
            <Mensagem tipo="sucesso">
              Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. Confira também o spam.
            </Mensagem>
            <Button variant="secondary" onClick={aoVoltar}>Voltar ao login</Button>
          </div>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-4">
            <Campo
              rotulo="E-mail da conta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar link'}
            </Button>
            <button type="button" className="text-sm text-green-700 underline" onClick={aoVoltar}>
              Voltar ao login
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}