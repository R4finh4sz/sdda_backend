import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres.'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;

