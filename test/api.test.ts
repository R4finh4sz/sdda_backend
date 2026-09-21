import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { Server } from 'node:http';
import { app } from '../src/app.js';
import { initDatabase, db } from '../src/config/database.js';

describe('API Integration Tests', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    initDatabase();
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
    db.close();
  });

  test('GET /health deve responder com status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');
  });

  test('POST /api/users/register deve falhar com erro Zod quando os dados forem inválidos', async () => {
    const res = await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Oi', // muito curto (min 3)
        email: 'email-invalido', // formato inválido
        password: '123', // muito curto (min 6)
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.message, 'Erro de validação nos dados fornecidos.');
    assert.ok(Array.isArray(data.errors));
    assert.strictEqual(data.errors.length, 3);
  });

  test('POST /api/users/register deve registrar usuário com sucesso e senha hasheada com bcrypt', async () => {
    const res = await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rafael Developer',
        email: 'rafael@exemplo.com',
        password: 'senhaSegura123',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.user.id);
    assert.strictEqual(data.user.email, 'rafael@exemplo.com');
    // A senha NUNCA deve ser retornada no JSON
    assert.strictEqual(data.user.password, undefined);
  });

  test('POST /api/users/register deve rejeitar e-mail duplicado', async () => {
    const res = await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rafael Clone',
        email: 'rafael@exemplo.com',
        password: 'outraSenha123',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 409);
    assert.strictEqual(data.message, 'E-mail já cadastrado no sistema.');
  });

  test('POST /api/users/login deve autenticar com sucesso usando a senha correta (bcrypt)', async () => {
    const res = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rafael@exemplo.com',
        password: 'senhaSegura123',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.message, 'Login realizado com sucesso!');
    assert.strictEqual(data.user.email, 'rafael@exemplo.com');
  });

  test('POST /api/users/login deve falhar com credenciais incorretas', async () => {
    const res = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rafael@exemplo.com',
        password: 'senhaErrada',
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.message, 'Credenciais inválidas.');
  });

  test('GET /api/users deve listar os usuários cadastrados', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(data.users));
    assert.ok(data.users.length >= 1);
  });
});

