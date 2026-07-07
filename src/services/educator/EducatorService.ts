import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

type EducatorStatus = 'ACTIVE' | 'BLOCKED' | 'INACTIVE';

interface CreateEducatorInput {
  name: string;
  email: string;
  password: string;
  cpf?: string;
  photo?: string;
}

interface UpdateEducatorInput {
  name?: string;
  email?: string;
  cpf?: string;
  photo?: string;
}

const EDUCATOR_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  cpf: true,
  photo: true,
  status: true,
  created_at: true,
};

class EducatorService {
  async create({ name, email, password, cpf, photo }: CreateEducatorInput) {
    const emailInUse = await prismaClient.user.findFirst({ where: { email } });
    if (emailInUse) throw new Error('Email already in use');

    if (cpf) {
      const cpfInUse = await prismaClient.user.findFirst({ where: { cpf } });
      if (cpfInUse) throw new Error('CPF already in use');
    }

    const passwordHash = await hash(password, 8);

    return prismaClient.user.create({
      data: { name, email, Password: passwordHash, role: 'EDUCATOR', cpf, photo },
      select: EDUCATOR_SELECT,
    });
  }

  async list() {
    return prismaClient.user.findMany({
      where: { role: 'EDUCATOR' },
      select: EDUCATOR_SELECT,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, { name, email, cpf, photo }: UpdateEducatorInput) {
    const educator = await prismaClient.user.findFirst({ where: { id, role: 'EDUCATOR' } });
    if (!educator) throw new Error('Educator not found');

    if (email && email !== educator.email) {
      const emailInUse = await prismaClient.user.findFirst({ where: { email, NOT: { id } } });
      if (emailInUse) throw new Error('Email already in use');
    }

    if (cpf && cpf !== educator.cpf) {
      const cpfInUse = await prismaClient.user.findFirst({ where: { cpf, NOT: { id } } });
      if (cpfInUse) throw new Error('CPF already in use');
    }

    return prismaClient.user.update({
      where: { id },
      data: { name, email, cpf, photo },
      select: EDUCATOR_SELECT,
    });
  }

  async updateStatus(id: string, status: EducatorStatus) {
    const educator = await prismaClient.user.findFirst({ where: { id, role: 'EDUCATOR' } });
    if (!educator) throw new Error('Educator not found');

    return prismaClient.user.update({
      where: { id },
      data: { status },
      select: EDUCATOR_SELECT,
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
