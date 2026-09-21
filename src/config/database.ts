import Database from 'better-sqlite3';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_URL || 'database.sqlite';

export const db = new Database(dbPath);

// Ativa foreign keys e modo WAL para alta performance e confiabilidade
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Criação automática de tabelas iniciais
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('📦 Banco de dados inicializado com sucesso (SQLite/H2-compatible).');
}

