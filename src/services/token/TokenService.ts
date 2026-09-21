import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class TokenService {
  private static readonly secret = process.env.JWT_SECRET || 'default_secret_jwt';
  private static readonly expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  public static generate(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }

  public static verify<T = any>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }
}

