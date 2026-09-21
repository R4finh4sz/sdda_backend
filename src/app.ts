import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes.js';

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use(router);

// Handler para rotas inexistentes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Rota ${req.method} ${req.url} não encontrada.`,
  });
});

// Middleware global de tratamento de erros (500)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado na aplicação:', err);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export { app };

