import { describe, expect, it } from 'vitest';
import { NovaSenhaSchema } from './senha';

describe('NovaSenhaSchema', () => {
  it('aceita senha de 8+ caracteres confirmada', () =>
    expect(NovaSenhaSchema.safeParse({ senha: 'abc12345', confirmacao: 'abc12345' }).success).toBe(true));

  it('rejeita senha curta', () =>
    expect(NovaSenhaSchema.safeParse({ senha: 'abc123', confirmacao: 'abc123' }).success).toBe(false));

  it('rejeita confirmação diferente e aponta o campo', () => {
    const r = NovaSenhaSchema.safeParse({ senha: 'abc12345', confirmacao: 'abc12346' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(['confirmacao']);
  });
});