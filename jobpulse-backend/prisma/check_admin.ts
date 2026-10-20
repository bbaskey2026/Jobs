import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function checkAdmin() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@jobpulse.in' }
  });

  if (!admin) {
    console.log('Admin user does not exist');
    return;
  }

  const isMatch = await argon2.verify(admin.passwordHash, 'Admin@12345');
  console.log({
    email: admin.email,
    role: admin.role,
    passwordMatch: isMatch
  });
}

checkAdmin().catch(console.error).finally(() => prisma.$disconnect());
