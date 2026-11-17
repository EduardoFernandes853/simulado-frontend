import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProvaSimulado } from './ProvaSimulado';
import { lerRascunho, salvarRascunho } from '../../lib/rascunho';
import * as api from '../../lib/api';
import type { IniciarTentativaResposta } from '../../contracts';

vi.mock('../../lib/api', () => ({
  post: vi.fn(),
  mensagemDeErro: () => 'erro de envio',
}));

const Q = '22222222-2222-4222-8222-222222222222';
const prova: IniciarTentativaResposta = {
  tentativaId: '11111111-1111-4111-8111-111111111111',
  titulo: 'Diagnóstico',
  segundosRestantes: 1800,
  questoes: [
    {
      id: Q, enunciado: 'Primeira?', disciplina: 'Redes', topico: 'Transporte',
      alternativas: [{ letra: 'A', texto: 'TCP' }, { letra: 'B', texto: 'UDP' }],
    },
  ],
};

const fimEm = () => Date.now() + 1800_000;
const resultado = { tentativaId: prova.tentativaId, nota: 100, acertos: 1, total: 1, porTopico: [], alertaMonitoria: false, limiar: 60 };

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('ProvaSimulado: autosave', () => {
  it('grava a resposta como rascunho ao marcar uma alternativa', () => {
    render(<ProvaSimulado prova={prova} fimEm={fimEm()} aoFinalizar={vi.fn()} />);
    fireEvent.click(screen.getByLabelText(/TCP/));
    expect(lerRascunho(prova.tentativaId)).toEqual({ [Q]: 'A' });
  });

  it('restaura as respostas depois de recarregar a página', () => {
    salvarRascunho(prova.tentativaId, { [Q]: 'B' });
    render(<ProvaSimulado prova={prova} fimEm={fimEm()} aoFinalizar={vi.fn()} />);
    expect((screen.getByLabelText(/UDP/) as HTMLInputElement).checked).toBe(true);
  });

  it('apaga o rascunho depois de finalizar com sucesso', async () => {
    salvarRascunho(prova.tentativaId, { [Q]: 'A' });
    vi.mocked(api.post).mockResolvedValue(resultado);
    const aoFinalizar = vi.fn();
    
    render(<ProvaSimulado prova={prova} fimEm={fimEm()} aoFinalizar={aoFinalizar} />);
    fireEvent.click(screen.getByRole('button', { name: /finalizar simulado/i }));
    
    await waitFor(() => expect(aoFinalizar).toHaveBeenCalled());
    expect(lerRascunho(prova.tentativaId)).toEqual({});
  });

  it('mantém o rascunho quando o envio falha', async () => {
    salvarRascunho(prova.tentativaId, { [Q]: 'A' });
    vi.mocked(api.post).mockRejectedValue(new Error('rede'));
    
    render(<ProvaSimulado prova={prova} fimEm={fimEm()} aoFinalizar={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /finalizar simulado/i }));
    
    await screen.findByText('erro de envio');
    expect(lerRascunho(prova.tentativaId)).toEqual({ [Q]: 'A' });
  });
});