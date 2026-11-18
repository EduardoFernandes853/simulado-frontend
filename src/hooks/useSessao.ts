import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { abriuPorLinkDeRecuperacao } from '../lib/recuperacao';

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [recuperando, setRecuperando] = useState(abriuPorLinkDeRecuperacao);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      setSessao(s);
      if (evento === 'PASSWORD_RECOVERY') setRecuperando(true);
      if (evento === 'SIGNED_OUT') setRecuperando(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const concluirRecuperacao = useCallback(() => {
    setRecuperando(false);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return { sessao, carregando, recuperando, concluirRecuperacao };
}