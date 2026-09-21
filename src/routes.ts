import { Router } from 'express';
import { userController } from './modules/user/user.controller.js';
import { createUserSchema, loginUserSchema } from './modules/user/user.schema.js';
import { validate } from './middlewares/validate.js';

const router = Router();

// Rota de verificação de integridade da API
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API sdda_backend operando normalmente.',
    timestamp: new Date().toISOString(),
  });
});

// Rotas de Usuário com validação Zod
router.post('/api/users/register', validate(createUserSchema), (req, res) => userController.register(req, res));
router.post('/api/users/login', validate(loginUserSchema), (req, res) => userController.login(req, res));
router.get('/api/users', (req, res) => userController.list(req, res));

export { router };

