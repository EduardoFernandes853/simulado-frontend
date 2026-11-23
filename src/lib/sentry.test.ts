import { describe, expect, it, vi } from 'vitest';

vi.mock('@sentry/react', () => ({ init: vi.fn(), captureException: vi.fn() }));

import * as Sentry from '@sentry/react';
import { iniciarSentry, registrarErroDeInterface } from './sentry';

describe('sentry', () => {
  it('não inicia nada sem DSN (desenvolvimento, testes e preview)', async () => {
    await iniciarSentry();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('registrar um erro antes de iniciar é inofensivo', () => {
    expect(() => registrarErroDeInterface(new Error('x'), 'em <App>')).not.toThrow();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});