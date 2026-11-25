import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MinhaConta } from './MinhaConta';
import { api } from '../../lib/api';
import { baixarArquivo } from '../../lib/download';

vi.mock('../../lib/api', () => ({
  api: { patch: vi.fn(), get: vi.fn(), delete: vi.fn() },
  mensagemDeErro: () => 'falha',
}));
vi.mock('../../lib/download', () => ({ baixarArquivo: vi.fn() }));

const aluno = {
  id: '55555555-5555-4555-8555-555555555555',
  nome: 'Maria Souza',
  matricula: '20260001',
  email: '20260001@aluno.ifpa.edu.br',
  papel: 'ALUNO' as const,
  avisoVersao: 'v1',
};

function montar(extra: Partial<typeof aluno> = {}) {
  const props = {
    aluno: { ...aluno, ...extra },
    aoAtualizar: vi.fn(),
    aoVoltar: vi.fn(),
    aoVerAviso: vi.fn(),
    aoExcluir: vi.fn(),
  };
  render(<MinhaConta {...props} />);
  return props;
}

beforeEach(() => vi.clearAllMocks());

describe('MinhaConta', () => {
  it('mostra matrícula e e-mail, mas só o nome é editável', () => {
    montar();
    expect(screen.getByText('20260001')).toBeTruthy();
    expect(screen.getByText('20260001@aluno.ifpa.edu.br')).toBeTruthy();
    expect(screen.queryByLabelText(/matrícula/i)).toBeNull();
  });

  it('salva o nome e avisa o app', async () => {
    const atualizado = { ...aluno, nome: 'Maria da Silva' };
    vi.mocked(api.patch).mockResolvedValue({ data: atualizado });
    const props = montar();

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria da Silva' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar nome/i }));

    await waitFor(() => expect(props.aoAtualizar).toHaveBeenCalledWith(atualizado));
    expect(api.patch).toHaveBeenCalledWith('/me', { nome: 'Maria da Silva' });
  });

  it('recusa nome curto sem chamar a API', () => {
    montar();
    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar nome/i }));
    expect(screen.getByRole('alert').textContent).toBe('Informe o nome completo.');
    expect(api.patch).not.toHaveBeenCalled();
  });

  it('baixa os dados do titular', async () => {
    const conteudo = new Blob(['{}']);
    vi.mocked(api.get).mockResolvedValue({ data: conteudo });
    montar();

    fireEvent.click(screen.getByRole('button', { name: /baixar meus dados/i }));

    await waitFor(() => expect(baixarArquivo).toHaveBeenCalledWith(conteudo, 'meus-dados.json'));
    expect(api.get).toHaveBeenCalledWith('/me/dados', { responseType: 'blob' });
  });

  it('só habilita a exclusão depois de digitar EXCLUIR e então chama a API', async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    const props = montar();
    const botao = screen.getByRole('button', { name: /excluir minha conta/i }) as HTMLButtonElement;
    expect(botao.disabled).toBe(true);

    fireEvent.change(screen.getByLabelText('Digite EXCLUIR para confirmar'), { target: { value: 'EXCLUIR' } });
    expect(botao.disabled).toBe(false);
    fireEvent.click(botao);

    await waitFor(() => expect(props.aoExcluir).toHaveBeenCalledTimes(1));
    expect(api.delete).toHaveBeenCalledWith('/me', { data: { confirmacao: 'EXCLUIR' } });
  });

  it('não sai do app quando a exclusão falha', async () => {
    vi.mocked(api.delete).mockRejectedValue(new Error('x'));
    const props = montar();
    fireEvent.change(screen.getByLabelText('Digite EXCLUIR para confirmar'), { target: { value: 'EXCLUIR' } });
    fireEvent.click(screen.getByRole('button', { name: /excluir minha conta/i }));
    expect((await screen.findByRole('alert')).textContent).toBe('falha');
    expect(props.aoExcluir).not.toHaveBeenCalled();
  });

  it('professor não vê a exclusão (quem remove é a coordenação)', () => {
    montar({ papel: 'PROFESSOR' } as never);
    expect(screen.queryByRole('button', { name: /excluir minha conta/i })).toBeNull();
  });
});