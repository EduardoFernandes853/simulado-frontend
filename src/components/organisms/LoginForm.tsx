import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { mensagemAuth } from '../../lib/erros-auth';
import { mensagemDeErro, post } from '../../lib/api';
import { ConviteRespostaSchema, DOMINIO_ALUNO, matriculaDoEmail } from '../../contracts';
import { Button } from '../atoms/Button';
import { Campo } from '../molecules/Campo';
import { Card } from '../molecules/Card';
import { Mensagem } from '../molecules/Mensagem';
import { RecuperarSenhaForm } from './RecuperarSenhaForm';

const DOMINIO = import.meta.env.VITE_DOMINIO_ALUNO || DOMINIO_ALUNO;

export function LoginForm({ erroInicial }: { erroInicial?: string | null }) {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');
  const [recuperando, setRecuperando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(erroInicial ?? null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const matricula = modo === 'cadastrar' ? matriculaDoEmail(email, DOMINIO) : null;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    const emailLimpo = email.trim().toLowerCase();

    if (modo === 'cadastrar') {
      if (nome.trim().length < 3) { setErro('Informe o nome completo.'); return; }
      if (!matriculaDoEmail(emailLimpo, DOMINIO)) { setErro(`Use seu e-mail institucional (matrícula@${DOMINIO}).`); return; }
      setCarregando(true);
      try {
        const resposta = await post('/cadastro', { email: emailLimpo, nome: nome.trim() }, ConviteRespostaSchema);
        setAviso(resposta.mensagem);
      } catch (falha) {
        setErro(mensagemDeErro(falha));
      } finally {
        setCarregando(false);
      }
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailLimpo, password: senha });
      if (error) setErro(mensagemAuth(error));
    } catch {
      setErro('Sem conexão. Verifique a internet e tente de novo.');
    } finally {
      setCarregando(false);
    }
  }

  if (recuperando) return <RecuperarSenhaForm aoVoltar={() => setRecuperando(false)} />;

  return (
    <div className="mx-auto max-w-md">
      <Card titulo={modo === 'entrar' ? 'Entrar' : 'Primeiro acesso'} destaque>
        <form onSubmit={enviar} className="flex flex-col gap-4">
          {modo === 'cadastrar' && (
            <Campo rotulo="Nome completo" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} required />
          )}
          <Campo
            rotulo={modo === 'entrar' ? 'E-mail' : 'E-mail institucional'}
            type="email"
            autoComplete="email"
            placeholder={modo === 'cadastrar' ? `matricula@${DOMINIO}` : undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {matricula && <p className="-mt-2 text-sm text-slate-600">Sua matrícula: <strong>{matricula}</strong></p>}
          {modo === 'entrar' && (
            <Campo
              rotulo="Senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          )}
          {modo === 'cadastrar' && (
            <p className="text-sm text-slate-500">Você receberá um e-mail com o link para definir sua senha.</p>
          )}
          {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
          {aviso && <Mensagem tipo="info">{aviso}</Mensagem>}
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Enviar convite'}
          </Button>
          {modo === 'entrar' && (
            <button type="button" className="text-sm text-green-700 underline" onClick={() => setRecuperando(true)}>
              Esqueci minha senha
            </button>
          )}
          <button
            type="button"
            className="text-sm text-green-700 underline"
            onClick={() => { setModo(modo === 'entrar' ? 'cadastrar' : 'entrar'); setErro(null); setAviso(null); }}
          >
            {modo === 'entrar' ? 'Não tenho conta' : 'Já tenho conta'}
          </button>
        </form>
      </Card>
    </div>
  );
}