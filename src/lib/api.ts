import axios from 'axios';
import { ZodError } from 'zod';
import type { ZodType } from 'zod';
import { supabase } from './supabase';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session) config.headers.Authorization = `Bearer ${data.session.access_token}`;
  return config;
});

// As respostas são validadas contra os contratos compartilhados
export async function get<T>(url: string, schema: ZodType<T>): Promise<T> {
  const { data } = await api.get(url);
  return schema.parse(data);
}

export async function post<T>(url: string, corpo: unknown, schema: ZodType<T>): Promise<T> {
  const { data } = await api.post(url, corpo);
  return schema.parse(data);
}

export function mensagemDeErro(e: unknown): string {
  if (e instanceof ZodError) {
    console.error('Resposta fora do contrato:', e.issues); // detalhe só no console
    return 'O servidor respondeu em um formato inesperado. Atualize a página e tente de novo.';
  }
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Sem conexão com o servidor.';
    return (e.response.data as { erro?: string } | undefined)?.erro ?? 'Erro inesperado.';
  }
  return 'Erro inesperado.'; // nunca expõe e.message cru
}