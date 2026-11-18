import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RevisaoProva } from './RevisaoProva';
import * as api from '../../lib/api';
import type { Revisao } from '../../contracts';

vi.mock('../../lib/api', () => ({ get: vi.fn(), mensagemDeErro: () => 'falha ao carregar' }));

const T = '11111111-1111-4111-8111-111111111111';
const Q1 = '22222222-2222-4222-8222-222222222222';
const Q2 = '33333333-3333-4333-8333-333333333333';

const revisao: Revisao = {
  tentativaId: T,
  simulado: 'Diagnóstico',
  nota: 50,
  questoes: [
    {
      questaoId: Q1, enunciado: 'Qual protocolo é confiável?', disciplina: 'Redes', topico: 'Transporte',
      alternativas: [{ letra: 'A', texto: 'TCP' }, { letra: 'B', texto: 'UDP' }],
      escolhida: 'B', correta: 'A', justificativa: 'O TCP confirma a entrega.', acertou: false,
    },
    {
      questaoId: Q2, enunciado: 'Quanto é 2 + 2?', disciplina: 'Matemática', topico: 'Álgebra',
      alternativas: [{ letra: 'A', texto: '3' }, { letra: 'B', texto: '4' }],
      escolhida: null, correta: 'B', justificativa: null, acertou: false,
    },
  ],
};

beforeEach(() => vi.clearAllMocks());

describe('RevisaoProva', () => {
  it('busca a revisão da tentativa certa', async () => {
    vi.mocked(api.get).mockResolvedValue(revisao);
    render(<RevisaoProva tentativaId={T} aoVoltar={vi.fn()} />);
    await screen.findByText('Quanto é 2 + 2?');
    expect(api.get).toHaveBeenCalledWith(`/tentativas/${T}/revisao`, expect.anything());
  });

  it('marca erro e questão em branco, indica a correta e mostra a justificativa', async () => {
    vi.mocked(api.get).mockResolvedValue(revisao);
    render(<RevisaoProva tentativaId={T} aoVoltar={vi.fn()} />);

    await screen.findByText('Qual protocolo é confiável?');
    expect(screen.getByText('Errou')).toBeTruthy();
    expect(screen.getByText('Em branco')).toBeTruthy();
    expect(screen.getByText('sua resposta')).toBeTruthy();
    expect(screen.getAllByText('correta')).toHaveLength(2);
    expect(screen.getByText('O TCP confirma a entrega.')).toBeTruthy();
  });

  it('mostra o erro e permite voltar quando a busca falha', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('rede'));
    const aoVoltar = vi.fn();
    render(<RevisaoProva tentativaId={T} aoVoltar={aoVoltar} />);

    await screen.findByText('falha ao carregar');
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(aoVoltar).toHaveBeenCalledTimes(1);
  });
});