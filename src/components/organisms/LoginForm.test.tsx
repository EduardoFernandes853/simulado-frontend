import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { supabase } from '../../lib/supabase';
import { DOMINIO_ALUNO } from '../../contracts';

vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { signUp: vi.fn(), signInWithPassword: vi.fn(), resetPasswordForEmail: vi.fn() } },
}));

const EMAIL = `20261234@${DOMINIO_ALUNO}`;

function abrirCadastro() {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /não tenho conta/i }));
}

function preencherCadastro(nome: string, email: string, senha: string) {
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: nome } });
  fireEvent.change(screen.getByLabelText('E-mail institucional'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: senha } });
  fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }));
}

beforeEach(() => vi.clearAllMocks());

describe('LoginForm: cadastro', () => {
  it('não pede matrícula', () => {
    abrirCadastro();
    expect(screen.queryByLabelText(/matrícula/i)).toBeNull();
  });

  it('mostra a matrícula derivada do e-mail digitado', () => {
    abrirCadastro();
    fireEvent.change(screen.getByLabelText('E-mail institucional'), { target: { value: EMAIL } });
    expect(screen.getByText('20261234')).toBeTruthy();
  });

  it('recusa e-mail fora do domínio sem chamar o Supabase', () => {
    abrirCadastro();
    preencherCadastro('Maria Souza', 'maria@gmail.com', 'senha-segura-1');
    expect(screen.getByRole('alert').textContent).toContain(`@${DOMINIO_ALUNO}`);
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('cadastra com e-mail normalizado, sem matrícula nos metadados, e pede a confirmação', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({ data: { user: null, session: null }, error: null } as never);
    abrirCadastro();

    preencherCadastro('Maria Souza', `20261234@${DOMINIO_ALUNO.toUpperCase()}`, 'senha-segura-1');

    await waitFor(() => expect(supabase.auth.signUp).toHaveBeenCalledTimes(1));
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: EMAIL,
      password: 'senha-segura-1',
      options: { data: { nome: 'Maria Souza' }, emailRedirectTo: window.location.origin },
    });
    expect((await screen.findByRole('alert')).textContent).toMatch(/link de confirmação/i);
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