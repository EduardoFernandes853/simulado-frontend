import { beforeEach, describe, expect, it } from 'vitest';
import {
  lerRascunho, limparRascunho, limparTodosRascunhos, purgarRascunhosAntigos, salvarRascunho,
} from './rascunho';
import type { Armazenamento } from './rascunho';

class Falso implements Armazenamento {
  dados = new Map<string, string>();
  quebrado = false;
  get length() { return this.dados.size; }
  key(i: number) { return [...this.dados.keys()][i] ?? null; }
  getItem(k: string) { return this.dados.get(k) ?? null; }
  setItem(k: string, v: string) { if (this.quebrado) throw new Error('cota'); this.dados.set(k, v); }
  removeItem(k: string) { this.dados.delete(k); }
}

const T = 'tentativa-1';
let s: Falso;

beforeEach(() => { s = new Falso(); });

describe('rascunho da prova', () => {
  it('devolve vazio quando não há rascunho', () => expect(lerRascunho(T, s)).toEqual({}));
  it('salva e recupera as respostas', () => {
    expect(salvarRascunho(T, { q1: 'A', q2: 'C' }, s)).toBe(true);
    expect(lerRascunho(T, s)).toEqual({ q1: 'A', q2: 'C' });
  });
  it('isola rascunhos de tentativas diferentes', () => {
    salvarRascunho('t-a', { q1: 'A' }, s);
    expect(lerRascunho('t-b', s)).toEqual({});
  });
  it.each(['{quebrado', 'null', '[1,2]', '"texto"', '{"v":1}'])('ignora conteúdo inválido %p', (bruto) => {
    s.setItem(`prova:${T}`, bruto);
    expect(lerRascunho(T, s)).toEqual({});
  });
  it('descarta letras inválidas e valores que não são texto', () => {
    s.setItem(`prova:${T}`, JSON.stringify({ v: 1, salvoEm: Date.now(), respostas: { q1: 'A', q2: 'Z', q3: 3, q4: 'a' } }));
    expect(lerRascunho(T, s)).toEqual({ q1: 'A' });
  });
  it('não lança quando o armazenamento falha (cota ou modo privado)', () => {
    s.quebrado = true;
    expect(salvarRascunho(T, { q1: 'A' }, s)).toBe(false);
  });
  it('limpa o rascunho de uma tentativa', () => {
    salvarRascunho(T, { q1: 'A' }, s);
    limparRascunho(T, s);
    expect(lerRascunho(T, s)).toEqual({});
  });
  it('limparTodos remove só rascunhos, nunca a sessão do Supabase', () => {
    salvarRascunho('t-a', { q1: 'A' }, s);
    salvarRascunho('t-b', { q1: 'B' }, s);
    s.setItem('sb-abc-auth-token', '{"sessao":true}');
    limparTodosRascunhos(s);
    expect(s.length).toBe(1);
    expect(s.getItem('sb-abc-auth-token')).not.toBeNull();
  });
  it('purga rascunhos com mais de 24 h ou corrompidos e mantém os recentes', () => {
    const agora = Date.now();
    s.setItem('prova:velho', JSON.stringify({ v: 1, salvoEm: agora - 25 * 3600_000, respostas: { q1: 'A' } }));
    s.setItem('prova:novo', JSON.stringify({ v: 1, salvoEm: agora - 3600_000, respostas: { q1: 'B' } }));
    s.setItem('prova:corrompido', '{xx');
    purgarRascunhosAntigos(s, agora);
    expect(s.getItem('prova:velho')).toBeNull();
    expect(s.getItem('prova:corrompido')).toBeNull();
    expect(s.getItem('prova:novo')).not.toBeNull();
  });
});