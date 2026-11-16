import { AuthError } from '@supabase/supabase-js';

const MENSAGENS: Record<string, string> = {
  'invalid_credentials': 'E-mail ou senha inválidos.',
  'user_not_found': 'Usuário não encontrado.',
  // adicione outros códigos se precisar no futuro
};

export function mensagemAuth(e: AuthError): string {
  // Se for erro de rede (Supabase pausado ou sem internet)
  if (e.name === 'AuthRetryableFetchError' || /failed to fetch|network/i.test(e.message)) {
    return 'Não foi possível conectar ao servidor de autenticação. Tente novamente em instantes.';
  }
  // Se for erro mapeado (senha errada mesmo) ou genérico
  return (e.code && MENSAGENS[e.code]) || 'Não foi possível concluir. Tente novamente.';
}