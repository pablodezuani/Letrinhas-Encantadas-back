import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

interface CreateEducatorInput {
  name: string;
  email: string;
  password: string;
}

class EducatorService {
  async create({ name, email, password }: CreateEducatorInput) {
    const exists = await prismaClient.user.findFirst({ where: { email } });

    if (exists) throw new Error('Email already in use');

    const passwordHash = await hash(password, 8);

    return prismaClient.user.create({
      data: { name, email, Password: passwordHash, role: 'EDUCATOR' },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });
  }

  async list() {
    return prismaClient.user.findMany({
      where: { role: 'EDUCATOR' },
      select: { id: true, name: true, email: true, role: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async delete(id: string) {
    const educator = await prismaClient.user.findFirst({
      where: { id, role: 'EDUCATOR' },
    });

    if (!educator) throw new Error('Educator not found');

    await prismaClient.user.delete({ where: { id } });

    return { message: 'Educator deleted successfully' };
  }
}

export { EducatorService };
