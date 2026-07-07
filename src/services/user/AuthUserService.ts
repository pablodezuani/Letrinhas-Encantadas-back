import prismaClient from '../../prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    const user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error('User/password incorrect');
    }

    const passwordMatch = await compare(password, user.Password);

    if (!passwordMatch) {
      throw new Error('User/password incorrect');
    }

    if (user.status === 'BLOCKED') {
      throw new Error('Este acesso foi bloqueado. Fale com um administrador.');
    }

    if (user.status === 'INACTIVE') {
      throw new Error('Este cadastro está inativo. Fale com um administrador.');
    }

    const token = sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { subject: user.id, expiresIn: '30d' },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }
}

export { AuthUserService };
