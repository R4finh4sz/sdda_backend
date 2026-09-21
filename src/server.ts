import dotenv from 'dotenv';
import { app } from './app.js';
import { initDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3333;

// Inicializa a base de dados
initDatabase();

// Inicializa o servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 URL base: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});

