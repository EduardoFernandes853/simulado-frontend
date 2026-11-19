import { describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { mensagemDeErro } from './api';

vi.mock('./supabase', () => ({ supabase: { auth: { getSession: vi.fn() } } }));

describe('mensagemDeErro', () => {
  it('não mostra o JSON do Zod quando a resposta foge do contrato', () => {
    const silenciar = vi.spyOn(console, 'error').mockImplementation(() => {});
    const r = z.object({ tentativaId: z.string() }).safeParse({});
    if (r.success) throw new Error('o teste precisa de um erro de validação');

    const msg = mensagemDeErro(r.error);

    expect(msg).toMatch(/formato inesperado/i);
    expect(msg).not.toMatch(/invalid_type|tentativaId/);
    expect(silenciar).toHaveBeenCalled(); // o detalhe vai para o console, não para o aluno
    silenciar.mockRestore();
  });

  it('avisa quando não há conexão', () => {
    expect(mensagemDeErro(new AxiosError('Network Error'))).toBe('Sem conexão com o servidor.');
  });

  it('mostra a mensagem em português enviada pela API', () => {
    const e = new AxiosError('x', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 409, statusText: 'Conflict', headers: {}, config: {} as never, data: { erro: 'Tentativa já finalizada.' },
    });
    expect(mensagemDeErro(e)).toBe('Tentativa já finalizada.');
  });

  it('não vaza a mensagem crua de erros desconhecidos', () => {
    expect(mensagemDeErro(new Error('detalhe interno'))).toBe('Erro inesperado.');
  });
});