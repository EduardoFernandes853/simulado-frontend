import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

vi.mock('../components/molecules/StatusSistema', () => ({ StatusSistema: () => null }));

describe('AppShell', () => {
  it('mostra o Sair mesmo sem usuário carregado (sessão presa por erro no /me)', () => {
    const aoSair = vi.fn();
    render(<AppShell aoSair={aoSair}><p>conteúdo</p></AppShell>);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));
    expect(aoSair).toHaveBeenCalledTimes(1);
  });

  it('mostra o nome do usuário quando há perfil', () => {
    render(<AppShell usuario={{ nome: 'Maria Souza', papel: 'ALUNO' }} aoSair={vi.fn()}><p>x</p></AppShell>);
    expect(screen.getByText('Maria Souza')).toBeTruthy();
  });

  it('não mostra Sair quando não há aoSair (tela de login)', () => {
    render(<AppShell><p>x</p></AppShell>);
    expect(screen.queryByRole('button', { name: /sair/i })).toBeNull();
  });

  it('renderiza o conteúdo', () => {
    render(<AppShell><p>conteúdo</p></AppShell>);
    expect(screen.getByText('conteúdo')).toBeTruthy();
  });
});