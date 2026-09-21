import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { app } from '../src/app.js';
import { prisma } from '../src/database/Database.js';
import { SeedService } from '../src/services/seed/SeedService.js';

dotenv.config();

const DEFAULT_FULL_NAME = process.env.DEFAULT_USER_FULL_NAME || 'Administrador do Sistema';
const DEFAULT_EMAIL = process.env.DEFAULT_USER_EMAIL || 'admin@sdda.com';
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'AdminPassword123!';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_jwt';

describe('Login & Seed Integration Tests (Prisma ORM)', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    // Executa o seed do usuário inicial
    await SeedService.seedDefaultUser();

    // Inicia o app Express em porta disponível
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await prisma.$disconnect();
  });

  test('Deve garantir que o banco possui o usuário da .env com email e senha criptografados via bcrypt (Prisma)', async () => {
    const users = await prisma.user.findMany();

    assert.strictEqual(users.length, 1);
    const user = users[0];

    assert.strictEqual(user.fullName, DEFAULT_FULL_NAME);

    // O email NÃO pode estar em texto puro, deve ser um hash bcrypt
    assert.notStrictEqual(user.email, DEFAULT_EMAIL);
    assert.ok(user.email.startsWith('$2a$') || user.email.startsWith('$2b$'));
    const isEmailValid = await bcrypt.compare(DEFAULT_EMAIL, user.email);
    assert.strictEqual(isEmailValid, true);

    // A senha NÃO pode estar em texto puro, deve ser um hash bcrypt
    assert.notStrictEqual(user.password, DEFAULT_PASSWORD);
    assert.ok(user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
    const isPasswordValid = await bcrypt.compare(DEFAULT_PASSWORD, user.password);
    assert.strictEqual(isPasswordValid, true);
  });

  test('GET /health deve responder com status 200 e status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');
  });

  test('POST /api/auth/login deve falhar com 400 se o email for inválido (validação Zod)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'email_invalido_sem_arroba',
        password: '123',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.message, 'Erro de validação nos dados fornecidos.');
    assert.ok(Array.isArray(data.errors));
    assert.strictEqual(data.errors[0].field, 'email');
  });

  test('POST /api/auth/login deve retornar 401 quando o email não corresponder ao cadastrado', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'outro_email@sdda.com',
        password: DEFAULT_PASSWORD,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.message, 'Credenciais inválidas.');
  });

  test('POST /api/auth/login deve retornar 401 quando a senha estiver incorreta', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: DEFAULT_EMAIL,
        password: 'senha_completamente_errada',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.message, 'Credenciais inválidas.');
  });

  test('POST /api/auth/login deve autenticar com sucesso e retornar token JWT válido', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.message, 'Login realizado com sucesso!');
    assert.ok(data.token, 'Deve conter o token JWT');
    assert.strictEqual(data.user.fullName, DEFAULT_FULL_NAME);

    // Validação da assinatura e payload do JWT
    const decoded: any = jwt.verify(data.token, JWT_SECRET);
    assert.strictEqual(decoded.fullName, DEFAULT_FULL_NAME);
    assert.strictEqual(decoded.sub, data.user.id);
  });
});
