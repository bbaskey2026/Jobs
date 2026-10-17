import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export async function processRetentionCleanup() {
  logger.info('Starting retention and cleanup processor...');

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Clean old job source runs older than 90 days
  const deletedRuns = await prisma.jobSourceRun.deleteMany({
    where: {
      startedAt: { lt: ninetyDaysAgo }
    }
  });

  // Clear expired password reset tokens
  const clearedTokens = await prisma.user.updateMany({
    where: {
      resetPasswordExpires: { lt: new Date() }
    },
    data: {
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  logger.info(
    { deletedRunsCount: deletedRuns.count, clearedTokensCount: clearedTokens.count },
    'Retention cleanup completed'
  );

  return {
    deletedRuns: deletedRuns.count,
    clearedTokens: clearedTokens.count
  };
}
