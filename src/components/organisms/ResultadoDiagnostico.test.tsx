import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ResultadoDiagnostico } from './ResultadoDiagnostico';
import type { ResultadoTentativa } from '../../contracts';

const resultado: ResultadoTentativa = {
  tentativaId: '11111111-1111-4111-8111-111111111111',
  nota: 20,
  acertos: 1,
  total: 5,
  porTopico: [{ disciplina: 'Redes', topico: 'Transporte', acertos: 0, total: 1, percentual: 0 }],
  alertaMonitoria: true,
  limiar: 60,
};

describe('ResultadoDiagnostico', () => {
  it('mostra nota, acertos e o aviso de monitoria', () => {
    render(<ResultadoDiagnostico resultado={resultado} aoVoltar={vi.fn()} aoRevisar={vi.fn()} />);
    expect(screen.getByText('20.0%')).toBeTruthy();
    expect(screen.getByText(/1 de 5 questões corretas/)).toBeTruthy();
    expect(screen.getByText(/monitoria acionada/i)).toBeTruthy();
  });

  it('oferece o gabarito comentado e chama aoRevisar', () => {
    const aoRevisar = vi.fn();
    render(<ResultadoDiagnostico resultado={resultado} aoVoltar={vi.fn()} aoRevisar={aoRevisar} />);
    fireEvent.click(screen.getByRole('button', { name: /ver gabarito comentado/i }));
    expect(aoRevisar).toHaveBeenCalledTimes(1);
  });

  it('continua oferecendo a volta ao início', () => {
    const aoVoltar = vi.fn();
    render(<ResultadoDiagnostico resultado={resultado} aoVoltar={aoVoltar} aoRevisar={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /voltar ao início/i }));
    expect(aoVoltar).toHaveBeenCalledTimes(1);
  });
});