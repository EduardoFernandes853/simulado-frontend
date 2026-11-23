/// <reference types="vite-plugin-pwa/client" />
import 'virtual:pwa-register';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary';
import { purgarRascunhosAntigos } from './lib/rascunho';
import { iniciarSentry } from './lib/sentry';

purgarRascunhosAntigos(); // descarta rascunhos com mais de 24 h
void iniciarSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)