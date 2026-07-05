import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@letrinhas.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrador';

  const exists = await prisma.user.findFirst({ where: { email } });

  if (exists) {
    console.log(`Admin já existe: ${email}`);
    return;
  }

  const passwordHash = await hash(password, 8);

  await prisma.user.create({
    data: { name, email, Password: passwordHash, role: 'ADMIN' },
  });

  console.log(`✅ Admin criado: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
