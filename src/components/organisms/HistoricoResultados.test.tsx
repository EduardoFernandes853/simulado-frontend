import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HistoricoResultados } from './HistoricoResultados';
import * as api from '../../lib/api';

vi.mock('../../lib/api', () => ({ get: vi.fn(), mensagemDeErro: () => 'erro' }));

const item = {
  id: '33333333-3333-4333-8333-333333333333',
  simulado: 'Diagnóstico',
  nota: 20,
  finalizadaEm: '2026-11-16T12:00:00.000Z',
  alertaMonitoria: true,
};

beforeEach(() => vi.clearAllMocks());

describe('HistoricoResultados', () => {
  it('cada tentativa tem um botão Revisar que informa o id', async () => {
    vi.mocked(api.get).mockResolvedValue([item]);
    const aoRevisar = vi.fn();
    render(<HistoricoResultados aoRevisar={aoRevisar} />);

    fireEvent.click(await screen.findByRole('button', { name: /revisar/i }));

    expect(aoRevisar).toHaveBeenCalledWith(item.id);
  });
});