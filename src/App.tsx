import { useEffect, useState } from 'react';
import { AppShell } from './templates/AppShell';
import { supabase } from './lib/supabase';
import { get, mensagemDeErro } from './lib/api';
import { useSessao } from './hooks/useSessao';
import { AlunoSchema } from './contracts';
import type { Aluno, IniciarTentativaResposta, ResultadoTentativa } from './contracts';
import { Button } from './components/atoms/Button';
import { Mensagem } from './components/molecules/Mensagem';
import { LoginForm } from './components/organisms/LoginForm';
import { ListaSimulados } from './components/organisms/ListaSimulados';
import { ProvaSimulado } from './components/organisms/ProvaSimulado';
import { ResultadoDiagnostico } from './components/organisms/ResultadoDiagnostico';
import { HistoricoResultados } from './components/organisms/HistoricoResultados';
import { PainelMonitoria } from './components/organisms/PainelMonitoria';
import { limparTodosRascunhos } from './lib/rascunho';

type Tela =
  | { nome: 'home' }
  | { nome: 'monitoria' }
  | { nome: 'prova'; prova: IniciarTentativaResposta; fimEm: number }
  | { nome: 'resultado'; resultado: ResultadoTentativa };

function AppAutenticado() {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [tela, setTela] = useState<Tela>({ nome: 'home' });

  // /me cria o cadastro no primeiro acesso; as demais telas só montam depois dele
  useEffect(() => {
    get('/me', AlunoSchema).then(setAluno).catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  return (
    <AppShell 
      usuario={aluno} 
      aoSair={() => { 
        limparTodosRascunhos(); 
        void supabase.auth.signOut(); 
      }}
    >
      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      {aluno && (tela.nome === 'home' || tela.nome === 'monitoria') && (
        <div className="space-y-8">
          {aluno.papel === 'PROFESSOR' && (
            <div className="flex gap-2">
              <Button variant={tela.nome === 'home' ? 'primary' : 'secondary'} onClick={() => setTela({ nome: 'home' })}>Simulados</Button>
              <Button variant={tela.nome === 'monitoria' ? 'primary' : 'secondary'} onClick={() => setTela({ nome: 'monitoria' })}>Monitoria</Button>
            </div>
          )}
          {tela.nome === 'home' ? (
            <>
              <ListaSimulados aoIniciar={(prova, fimEm) => setTela({ nome: 'prova', prova, fimEm })} />
              <HistoricoResultados />
            </>
          ) : (
            <PainelMonitoria />
          )}
        </div>
      )}
      {aluno && tela.nome === 'prova' && (
        <ProvaSimulado
          prova={tela.prova}
          fimEm={tela.fimEm}
          aoFinalizar={(resultado) => setTela({ nome: 'resultado', resultado })}
        />
      )}
      {aluno && tela.nome === 'resultado' && (
        <ResultadoDiagnostico resultado={tela.resultado} aoVoltar={() => setTela({ nome: 'home' })} />
      )}
    </AppShell>
  );
}

export default function App() {
  const { sessao, carregando } = useSessao();

  if (carregando) return <AppShell><p className="text-slate-400">Carregando…</p></AppShell>;
  if (!sessao) return <AppShell><LoginForm /></AppShell>;
  return <AppAutenticado key={sessao.user.id} />;
}