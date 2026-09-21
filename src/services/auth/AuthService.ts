import { prisma } from '../../database/Database.js';
import { HashService } from '../hash/HashService.js';
import { TokenService } from '../token/TokenService.js';

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    fullName: string;
  };
}

export class AuthService {
  public static async login(credentials: LoginParams): Promise<LoginResult> {
    const users = await prisma.user.findMany();

    let matchedUser = null;
    for (const user of users) {
      const isEmailEqual = await HashService.compare(credentials.email, user.email);
      if (isEmailEqual) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      throw new Error('Credenciais inválidas.');
    }

    const isPasswordEqual = await HashService.compare(
      credentials.password,
      matchedUser.password
    );

    if (!isPasswordEqual) {
      throw new Error('Credenciais inválidas.');
    }

    const token = TokenService.generate({
      sub: matchedUser.id,
      fullName: matchedUser.fullName,
    });

    return {
      token,
      user: {
        id: matchedUser.id,
        fullName: matchedUser.fullName,
      },
    };
  }
}
