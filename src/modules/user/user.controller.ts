import { Request, Response } from 'express';
import { userService } from './user.service.js';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user,
      });
    } catch (error: any) {
      if (error.message === 'E-mail já cadastrado no sistema.') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await userService.authenticate(req.body);
      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user,
      });
    } catch (error: any) {
      if (error.message === 'Credenciais inválidas.') {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
    }
  }

  list(req: Request, res: Response) {
    try {
      const users = userService.list();
      return res.status(200).json({ users });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Erro interno ao listar usuários.' });
    }
  }
}

export const userController = new UserController();

