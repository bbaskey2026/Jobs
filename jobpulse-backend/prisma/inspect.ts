import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const count = await prisma.job.count();
  const demoCount = await prisma.job.count({ where: { isDemoData: true } });
  const realCount = await prisma.job.count({ where: { isDemoData: false } });
  const sample = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      state: true,
      isDemoData: true,
      status: true,
      vacanciesCount: true,
      organization: { select: { name: true, sector: true } }
    },
    take: 15
  });
  console.log(JSON.stringify({ totalJobs: count, demoJobs: demoCount, realJobs: realCount }, null, 2));
  console.log('Sample jobs:', JSON.stringify(sample, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
