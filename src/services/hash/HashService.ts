import bcrypt from 'bcryptjs';

export class HashService {
  private static readonly saltRounds = 10;

  public static async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  public static async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}

