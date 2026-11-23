import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

vi.mock('../lib/sentry', () => ({ registrarErroDeInterface: vi.fn() }));

import { registrarErroDeInterface } from '../lib/sentry';
import { ErrorBoundary } from './ErrorBoundary';

function Bomba(): ReactElement {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('mostra o conteúdo quando não há erro', () => {
    render(<ErrorBoundary><p>tudo certo</p></ErrorBoundary>);
    expect(screen.getByText('tudo certo')).toBeTruthy();
  });

  it('mostra o aviso e permite recarregar quando um filho quebra', () => {
    const silenciar = vi.spyOn(console, 'error').mockImplementation(() => {});
    const recarregar = vi.fn();

    render(<ErrorBoundary aoRecarregar={recarregar}><Bomba /></ErrorBoundary>);

    expect(screen.getByRole('alert')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /recarregar/i }));
    expect(recarregar).toHaveBeenCalledTimes(1);
    expect(registrarErroDeInterface).toHaveBeenCalledWith(expect.any(Error), expect.any(String));

    silenciar.mockRestore();
  });
});