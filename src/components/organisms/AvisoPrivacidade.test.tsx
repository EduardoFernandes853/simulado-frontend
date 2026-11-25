import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AvisoPrivacidade } from './AvisoPrivacidade';
import { VERSAO_AVISO } from '../../contracts';
import { AVISO_EM_REVISAO, SECOES_AVISO } from '../../content/avisoPrivacidade';

describe('AvisoPrivacidade', () => {
  it('mostra a versão e todas as seções', () => {
    render(<AvisoPrivacidade />);
    expect(screen.getByText(`Versão ${VERSAO_AVISO}`)).toBeTruthy();
    for (const s of SECOES_AVISO) expect(screen.getByText(s.titulo)).toBeTruthy();
  });

  it('o botão Voltar só aparece quando há para onde voltar', () => {
    const aoVoltar = vi.fn();
    const { unmount } = render(<AvisoPrivacidade aoVoltar={aoVoltar} />);
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(aoVoltar).toHaveBeenCalledTimes(1);
    unmount();
    render(<AvisoPrivacidade />);
    expect(screen.queryByRole('button', { name: /voltar/i })).toBeNull();
  });

  it('avisa que é rascunho enquanto estiver em revisão', () => {
    render(<AvisoPrivacidade />);
    expect(screen.queryByText(/rascunho em revisão/i) !== null).toBe(AVISO_EM_REVISAO);
  });

  it('só pode ser publicado como definitivo sem lacunas [entre colchetes]', () => {
    if (AVISO_EM_REVISAO) return;
    expect(JSON.stringify(SECOES_AVISO)).not.toMatch(/\[[^\]]+\]/);
  });
});