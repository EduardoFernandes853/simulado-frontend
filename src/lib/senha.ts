import { z } from 'zod';

export const NovaSenhaSchema = z
  .object({
    senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirmacao: z.string(),
  })
  .refine((d) => d.senha === d.confirmacao, {
    message: 'As senhas não conferem.',
    path: ['confirmacao'],
  });