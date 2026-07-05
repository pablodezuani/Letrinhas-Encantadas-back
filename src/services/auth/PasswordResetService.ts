import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

class PasswordResetService {
  async requestReset(email: string) {
    const user = await prismaClient.user.findFirst({ where: { email } });

    // Retorna sucesso mesmo se email não existir (evita enumeração)
    if (!user) return { message: 'If the email exists, a reset link was sent.' };

    // Invalida tokens anteriores
    await prismaClient.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prismaClient.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    // TODO: enviar email com o token
    // await emailService.send({ to: email, token })
    console.log(`[PASSWORD RESET] Token para ${email}: ${token}`);

    return { message: 'If the email exists, a reset link was sent.' };
  }

  async confirmReset(token: string, newPassword: string) {
    const resetToken = await prismaClient.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new Error('Token invalid or expired');
    }

    const passwordHash = await hash(newPassword, 8);

    await prismaClient.user.update({
      where: { id: resetToken.userId },
      data: { Password: passwordHash },
    });

    await prismaClient.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return { message: 'Password updated successfully' };
  }
}

export { PasswordResetService };
