import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '../../config/database.js';
import { CreateUserInput, LoginUserInput } from './user.schema.js';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UserDatabaseRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export class UserService {
  async register(data: CreateUserInput): Promise<UserResponse> {
    const existing = db
      .prepare<[string], UserDatabaseRecord>('SELECT id FROM users WHERE email = ?')
      .get(data.email);

    if (existing) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = randomUUID();

    db.prepare(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'
    ).run(userId, data.name, data.email, hashedPassword);

    const user = db
      .prepare<[string], UserResponse>(
        'SELECT id, name, email, created_at FROM users WHERE id = ?'
      )
      .get(userId);

    if (!user) {
      throw new Error('Erro ao registrar usuário.');
    }

    return user;
  }

  async authenticate(data: LoginUserInput): Promise<UserResponse> {
    const user = db
      .prepare<[string], UserDatabaseRecord>(
        'SELECT id, name, email, password, created_at FROM users WHERE email = ?'
      )
      .get(data.email);

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  }

  list(): UserResponse[] {
    return db
      .prepare<[], UserResponse>(
        'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
      )
      .all();
  }
}

export const userService = new UserService();

