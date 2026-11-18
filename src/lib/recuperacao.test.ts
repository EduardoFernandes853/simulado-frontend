import { describe, expect, it } from 'vitest';
import { ehLinkDeRecuperacao, lerCodigoDeErroDoLink, mensagemDoErroDoLink } from './recuperacao';

describe('ehLinkDeRecuperacao', () => {
  it.each([
    ['#access_token=abc&refresh_token=x&type=recovery', '', true],
    ['#type=recovery', '', true],
    ['', '?type=recovery&token_hash=x', true],
    ['#access_token=abc&type=signup', '', false],
    ['#access_token=abc&type=magiclink', '', false],
    ['', '', false],
  ])('hash %p, query %p → %p', (hash, search, esperado) => {
    expect(ehLinkDeRecuperacao(hash, search)).toBe(esperado);
  });
});

describe('lerCodigoDeErroDoLink', () => {
  it('lê o código do hash de um link expirado', () => {
    expect(lerCodigoDeErroDoLink('#error=access_denied&error_code=otp_expired&error_description=x')).toBe('otp_expired');
  });

  it('devolve null quando não há erro', () => {
    expect(lerCodigoDeErroDoLink('#access_token=abc&type=recovery')).toBeNull();
    expect(lerCodigoDeErroDoLink('')).toBeNull();
  });
});

describe('mensagemDoErroDoLink', () => {
  it('explica link expirado', () => expect(mensagemDoErroDoLink('otp_expired')).toMatch(/expirou/i));
  it('tem mensagem genérica para outros códigos', () => expect(mensagemDoErroDoLink('outro')).toMatch(/novo/i));
  it('não mostra nada quando não há erro', () => expect(mensagemDoErroDoLink(null)).toBeNull());
});