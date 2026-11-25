import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CienciaAviso } from './CienciaAviso';
import { VERSAO_AVISO } from '../../contracts';
import * as api from '../../lib/api';

vi.mock('../../lib/api', () => ({
  post: vi.fn(),
  mensagemDeErro: () => 'falha ao registrar',
}));

const aluno = {
  id: '55555555-5555-4555-8555-555555555555',
  nome: 'Maria Souza',
  matricula: '20260001',
  email: '20260001@aluno.ifpa.edu.br',
  papel: 'ALUNO' as const,
  avisoVersao: VERSAO_AVISO,
};

beforeEach(() => vi.clearAllMocks());

describe('CienciaAviso', () => {
  it('o botão fica desabilitado até marcar a ciência', () => {
    render(<CienciaAviso aoConfirmar={vi.fn()} />);
    const botao = screen.getByRole('button', { name: /continuar/i }) as HTMLButtonElement;
    expect(botao.disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(botao.disabled).toBe(false);
  });

  it('registra a versão atual e devolve o perfil atualizado', async () => {
    vi.mocked(api.post).mockResolvedValue(aluno);
    const aoConfirmar = vi.fn();
    render(<CienciaAviso aoConfirmar={aoConfirmar} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => expect(aoConfirmar).toHaveBeenCalledWith(aluno));
    expect(api.post).toHaveBeenCalledWith('/me/ciencia', { versao: VERSAO_AVISO }, expect.anything());
  });

  it('mostra o erro e não segue quando o registro falha', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('x'));
    const aoConfirmar = vi.fn();
    render(<CienciaAviso aoConfirmar={aoConfirmar} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

    expect((await screen.findByRole('alert')).textContent).toBe('falha ao registrar');
    expect(aoConfirmar).not.toHaveBeenCalled();
  });
});