import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { supabase } from '../../lib/supabase';
import * as api from '../../lib/api';
import { DOMINIO_ALUNO } from '../../contracts';

vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { signUp: vi.fn(), signInWithPassword: vi.fn(), resetPasswordForEmail: vi.fn() } },
}));
vi.mock('../../lib/api', () => ({ post: vi.fn(), mensagemDeErro: () => 'falha no pedido' }));

const EMAIL = `20261234@${DOMINIO_ALUNO}`;

function abrirCadastro() {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /não tenho conta/i }));
}

function pedirConvite(nome: string, email: string) {
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: nome } });
  fireEvent.change(screen.getByLabelText('E-mail institucional'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: /enviar convite/i }));
}

beforeEach(() => vi.clearAllMocks());

describe('LoginForm: primeiro acesso por convite', () => {
  it('não pede matrícula nem senha', () => {
    abrirCadastro();
    expect(screen.queryByLabelText(/matrícula/i)).toBeNull();
    expect(screen.queryByLabelText('Senha')).toBeNull();
  });

  it('mostra a matrícula derivada do e-mail digitado', () => {
    abrirCadastro();
    fireEvent.change(screen.getByLabelText('E-mail institucional'), { target: { value: EMAIL } });
    expect(screen.getByText('20261234')).toBeTruthy();
  });

  it('recusa e-mail fora do domínio sem chamar a API', () => {
    abrirCadastro();
    pedirConvite('Maria Souza', 'maria@gmail.com');
    expect(screen.getByRole('alert').textContent).toContain(`@${DOMINIO_ALUNO}`);
    expect(api.post).not.toHaveBeenCalled();
  });

  it('pede o convite com e-mail normalizado e mostra a resposta do servidor', async () => {
    vi.mocked(api.post).mockResolvedValue({ mensagem: 'Convite enviado.' });
    abrirCadastro();
    pedirConvite('Maria Souza', `20261234@${DOMINIO_ALUNO.toUpperCase()}`);
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/cadastro', { email: EMAIL, nome: 'Maria Souza' }, expect.anything()),
    );
    expect((await screen.findByRole('status')).textContent).toBe('Convite enviado.');
  });

  it('mostra o erro quando o pedido falha', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('x'));
    abrirCadastro();
    pedirConvite('Maria Souza', EMAIL);
    expect((await screen.findByRole('alert')).textContent).toBe('falha no pedido');
  });
});

describe('LoginForm: entrada', () => {
  it('não impõe tamanho mínimo de senha (contas antigas têm 6 caracteres)', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: {}, error: null } as never);
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'antigo@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

    await waitFor(() =>
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'antigo@gmail.com', password: '123456' }),
    );
  });

  it('falha de rede não vira "senha inválida"', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {}, error: { name: 'AuthRetryableFetchError', message: 'Failed to fetch' },
    } as never);
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toMatch(/conectar/i);
    expect(alerta.textContent).not.toMatch(/senha/i);
  });
});