import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clean() {
  // Find organizations with 0 jobs
  const allOrgs = await prisma.organization.findMany({
    include: {
      _count: { select: { jobs: true } }
    }
  });

  const emptyOrgs = allOrgs.filter((o) => o._count.jobs === 0);
  console.log(`Found ${emptyOrgs.length} organizations with 0 jobs. Deleting empty/duplicate ones...`);

  for (const org of emptyOrgs) {
    await prisma.organization.delete({
      where: { id: org.id }
    });
  }

  const remaining = await prisma.organization.findMany({
    select: {
      name: true,
      slug: true,
      headquartersState: true,
      _count: { select: { jobs: true } }
    }
  });

  console.log('Clean active organizations with genuine vacancies:');
  console.log(JSON.stringify(remaining, null, 2));
}

clean().catch(console.error).finally(() => prisma.$disconnect());
