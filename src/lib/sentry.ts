let sentry: typeof import('@sentry/react') | null = null;

/** Só inicia em produção e com DSN. O SDK entra por import dinâmico: fora disso não pesa no pacote. */
export async function iniciarSentry(): Promise<void> {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || !import.meta.env.PROD) return;

  const S = await import('@sentry/react');
  const { limparEventoOuDescartar } = await import('./privacidade');
  S.init({
    dsn,
    environment: 'production',
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    // falhas de conexão do aluno não são defeito do sistema (quem avisa é o monitor de disponibilidade)
    ignoreErrors: ['Failed to fetch', 'Load failed', 'NetworkError when attempting to fetch resource.', 'ResizeObserver loop'],
    denyUrls: [/^chrome-extension:\/\//i, /^moz-extension:\/\//i],
    beforeSend: (evento) => limparEventoOuDescartar(evento),
  });
  sentry = S;
}

export function registrarErroDeInterface(erro: unknown, componentStack?: string | null): void {
  sentry?.captureException(erro, componentStack ? { contexts: { react: { componentStack } } } : undefined);
}