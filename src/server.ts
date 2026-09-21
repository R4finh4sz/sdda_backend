import dotenv from 'dotenv';
import { app } from './app.js';
import { SeedService } from './services/seed/SeedService.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3333;

async function bootstrap() {
  await SeedService.seedDefaultUser();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 URL base: http://localhost:${PORT}`);
    console.log(`🔐 Rota de Login: POST http://localhost:${PORT}/api/auth/login`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});

