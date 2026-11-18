import { describe, expect, it } from 'vitest';
import type { AuthError } from '@supabase/supabase-js';
import { mensagemAuth } from './erros-auth';

const erro = (e: Partial<AuthError>) => e as AuthError;

describe('mensagemAuth', () => {
  it('não confunde falha de rede com senha errada', () => {
    const m = mensagemAuth(erro({ name: 'AuthRetryableFetchError', message: 'Failed to fetch' }));
    expect(m).toMatch(/conectar/i);
    expect(m).not.toMatch(/senha/i);
  });

  it('traduz credenciais inválidas', () =>
    expect(mensagemAuth(erro({ code: 'invalid_credentials', message: 'x' }))).toBe('E-mail ou senha inválidos.'));

  it('traduz senha igual à atual', () =>
    expect(mensagemAuth(erro({ code: 'same_password', message: 'x' }))).toMatch(/diferente/i));

  it('traduz link expirado', () =>
    expect(mensagemAuth(erro({ code: 'otp_expired', message: 'x' }))).toMatch(/expirou/i));

  it('não vaza texto cru para erros desconhecidos', () =>
    expect(mensagemAuth(erro({ code: 'qualquer', message: 'detalhe interno' }))).not.toMatch(/detalhe interno/));
});