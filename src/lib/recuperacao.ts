const ler = (bruto: string, campo: string) =>
  new URLSearchParams(bruto.replace(/^[#?]/, '')).get(campo);

const TIPOS_QUE_EXIGEM_SENHA = ['recovery', 'invite'];

export function ehLinkDeRecuperacao(hash: string, search = ''): boolean {
  return (
    TIPOS_QUE_EXIGEM_SENHA.includes(ler(hash, 'type') ?? '') ||
    TIPOS_QUE_EXIGEM_SENHA.includes(ler(search, 'type') ?? '')
  );
}

export function lerCodigoDeErroDoLink(hash: string, search = ''): string | null {
  return ler(hash, 'error_code') ?? ler(search, 'error_code');
}

export function mensagemDoErroDoLink(codigo: string | null): string | null {
  if (!codigo) return null;
  return codigo === 'otp_expired'
    ? 'O link expirou ou já foi usado. Se você já definiu sua senha, entre normalmente ou use "Esqueci minha senha". Se ainda não tem conta, peça um novo convite.'
    : 'Não foi possível validar o link. Peça um novo.';
}

const hashInicial = typeof window === 'undefined' ? '' : window.location.hash;
const searchInicial = typeof window === 'undefined' ? '' : window.location.search;

export const abriuPorLinkDeRecuperacao = ehLinkDeRecuperacao(hashInicial, searchInicial);
export const erroInicialDoLink = mensagemDoErroDoLink(lerCodigoDeErroDoLink(hashInicial, searchInicial));