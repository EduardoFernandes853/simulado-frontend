import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NovaSenha } from './NovaSenha';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({ supabase: { auth: { updateUser: vi.fn() } } }));

const preencher = (senha: string, confirmacao: string) => {
  fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: senha } });
  fireEvent.change(screen.getByLabelText('Confirme a nova senha'), { target: { value: confirmacao } });
  fireEvent.click(screen.getByRole('button', { name: /salvar nova senha/i }));
};

beforeEach(() => vi.clearAllMocks());

describe('NovaSenha', () => {
  it('não chama o Supabase quando as senhas não conferem', () => {
    render(<NovaSenha aoConcluir={vi.fn()} />);
    preencher('abc12345', 'abc12346');
    expect(screen.getByText('As senhas não conferem.')).toBeTruthy();
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('atualiza a senha e conclui', async () => {
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({ data: { user: null }, error: null } as never);
    const aoConcluir = vi.fn();
    render(<NovaSenha aoConcluir={aoConcluir} />);
    preencher('abc12345', 'abc12345');
    await waitFor(() => expect(aoConcluir).toHaveBeenCalled());
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'abc12345' });
  });

  it('mostra a mensagem traduzida quando o Supabase recusa', async () => {
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: null },
      error: { code: 'same_password', message: 'x', name: 'AuthApiError' },
    } as never);
    render(<NovaSenha aoConcluir={vi.fn()} />);
    preencher('abc12345', 'abc12345');
    await screen.findByText(/diferente da atual/i);
  });
});