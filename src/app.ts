import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Rota ${req.method} ${req.url} não encontrada.`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
  });
});

export { app };

