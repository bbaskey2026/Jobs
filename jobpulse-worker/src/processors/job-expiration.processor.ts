import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export async function processJobExpiration() {
  const now = new Date();
  logger.info('Running deadline and job expiration processing sweep...');

  const result = await prisma.job.updateMany({
    where: {
      status: 'PUBLISHED',
      applicationDeadline: {
        lt: now
      }
    },
    data: {
      status: 'EXPIRED'
    }
  });

  logger.info({ expiredCount: result.count }, 'Job expiration sweep completed');
  return { expiredCount: result.count };
}
