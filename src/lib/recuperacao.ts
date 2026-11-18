const ler = (bruto: string, campo: string) =>
  new URLSearchParams(bruto.replace(/^[#?]/, '')).get(campo);

/** O link do e-mail traz type=recovery no hash (fluxo implícito) ou na query. */
export function ehLinkDeRecuperacao(hash: string, search = ''): boolean {
  return ler(hash, 'type') === 'recovery' || ler(search, 'type') === 'recovery';
}

export function lerCodigoDeErroDoLink(hash: string, search = ''): string | null {
  return ler(hash, 'error_code') ?? ler(search, 'error_code');
}

export function mensagemDoErroDoLink(codigo: string | null): string | null {
  if (!codigo) return null;
  return codigo === 'otp_expired'
    ? 'O link de recuperação expirou ou já foi usado. Solicite um novo.'
    : 'Não foi possível validar o link. Solicite um novo.';
}

// Calculados UMA vez, na carga do módulo, antes de o Supabase limpar o hash da URL.
// O evento PASSWORD_RECOVERY pode disparar antes de o React registrar o ouvinte, então não dá para depender só dele.
const hashInicial = typeof window === 'undefined' ? '' : window.location.hash;
const searchInicial = typeof window === 'undefined' ? '' : window.location.search;

export const abriuPorLinkDeRecuperacao = ehLinkDeRecuperacao(hashInicial, searchInicial);
export const erroInicialDoLink = mensagemDoErroDoLink(lerCodigoDeErroDoLink(hashInicial, searchInicial));