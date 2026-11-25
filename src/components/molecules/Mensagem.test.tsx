import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mensagem } from './Mensagem';

describe('Mensagem', () => {
  it('usa role="alert" para erro', () => {
    render(<Mensagem tipo="erro">Falha</Mensagem>);
    expect(screen.getByRole('alert').textContent).toBe('Falha');
  });

  it('usa role="status" para info e sucesso', () => {
    const { rerender } = render(<Mensagem tipo="info">Aviso</Mensagem>);
    expect(screen.getByRole('status').textContent).toBe('Aviso');
    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<Mensagem tipo="sucesso">Salvo</Mensagem>);
    expect(screen.getByRole('status').textContent).toBe('Salvo');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});