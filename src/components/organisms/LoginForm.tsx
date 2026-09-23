import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';

export function LoginForm() {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);

    if (modo === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro('E-mail ou senha inválidos.');
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome, matricula } },
      });
      if (error) setErro(error.message);
      else if (!data.session) setAviso('Conta criada. Confirme o e-mail para entrar.');
    }
    setCarregando(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <Card titulo={modo === 'entrar' ? 'Entrar' : 'Criar conta'} destaque>
        <form onSubmit={enviar} className="flex flex-col gap-4">
          {modo === 'cadastrar' && (
            <>
              <Campo rotulo="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <Campo rotulo="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
            </>
          )}
          <Campo rotulo="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Campo rotulo="Senha" type="password" minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} required />
          {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
          {aviso && <Mensagem tipo="info">{aviso}</Mensagem>}
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Cadastrar'}
          </Button>
          <button
            type="button"
            className="text-sm text-green-700 underline"
            onClick={() => setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')}
          >
            {modo === 'entrar' ? 'Não tenho conta' : 'Já tenho conta'}
          </button>
        </form>
      </Card>
    </div>
  );
}