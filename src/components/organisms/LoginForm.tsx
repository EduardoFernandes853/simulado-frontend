import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { mensagemAuth } from '../../lib/erros-auth';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';
import { RecuperarSenhaForm } from './RecuperarSenhaForm';

export function LoginForm({ erroInicial }: { erroInicial?: string | null }) {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(erroInicial ?? null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [recuperando, setRecuperando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);

    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) {
          setErro(mensagemAuth(error));
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { data: { nome, matricula } },
        });
        if (error) {
          setErro(mensagemAuth(error));
        } else if (!data.session) {
          setAviso('Conta criada. Confirme o e-mail para entrar.');
        }
      }
    } catch (err: unknown) {
      // Captura erros de rede brutos caso a API dispare uma exceção em vez de retornar o objeto error
      setErro(mensagemAuth(err as AuthError));
    } finally {
      setCarregando(false);
    }
  }

  if (recuperando) return <RecuperarSenhaForm aoVoltar={() => setRecuperando(false)} />;

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
          {modo === 'entrar' && (
            <button type="button" className="text-sm text-green-700 underline" onClick={() => setRecuperando(true)}>
              Esqueci minha senha
            </button>
          )}
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