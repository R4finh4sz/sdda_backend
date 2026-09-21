import { Router } from 'express';
import { AuthController } from '../controllers/auth/AuthController.js';

const router = Router();

router.post('/api/auth/login', (req, res) => {
  AuthController.login(req, res);
});

export { router };

