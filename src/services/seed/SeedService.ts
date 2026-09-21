import dotenv from 'dotenv';
import { prisma } from '../../database/Database.js';
import { HashService } from '../hash/HashService.js';

dotenv.config();

export class SeedService {
  public static async seedDefaultUser(): Promise<void> {
    const total = await prisma.user.count();
    if (total > 0) {
      return;
    }

    const fullName = process.env.DEFAULT_USER_FULL_NAME || 'Administrador do Sistema';
    const rawEmail = process.env.DEFAULT_USER_EMAIL || 'admin@sdda.com';
    const rawPassword = process.env.DEFAULT_USER_PASSWORD || 'AdminPassword123!';

    const hashedEmail = await HashService.hash(rawEmail);
    const hashedPassword = await HashService.hash(rawPassword);

    await prisma.user.create({
      data: {
        fullName,
        email: hashedEmail,
        password: hashedPassword,
      },
    });

    console.log(
      `🌱 Usuário inicial provisionado com sucesso via .env com Prisma: "${fullName}" (E-mail e senha criptografados com bcrypt)`
    );
  }
}
