import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { AuthService } from '../../services/auth/AuthService.js';

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = await loginSchema.parseAsync(req.body);
      const result = await AuthService.login(validatedData);

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        ...result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro de validação nos dados fornecidos.',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      if (error.message === 'Credenciais inválidas.') {
        return res.status(401).json({ message: error.message });
      }

      return res.status(500).json({
        message: error.message || 'Erro interno no servidor.',
      });
    }
  }
}

