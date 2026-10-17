import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { processAlertMatching } from './alert-matching.processor.js';

const prisma = new PrismaClient();

export async function processSourceSync(jobPayload: { sourceCode?: string }) {
  const sourceCode = jobPayload.sourceCode || 'OFFICIAL_UPSC';
  logger.info({ sourceCode }, 'Executing source synchronization background job');

  const source = await prisma.jobSource.findUnique({ where: { code: sourceCode } });
  if (!source || !source.isEnabled) {
    logger.info({ sourceCode }, 'Source is disabled or not found. Skipping.');
    return { status: 'skipped' };
  }

  // Find newly published jobs from this source to match alerts
  const recentJobs = await prisma.job.findMany({
    where: { sourceProvider: source.code, status: 'PUBLISHED' },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  for (const j of recentJobs) {
    await processAlertMatching({ jobId: j.id });
  }

  return { status: 'success', syncedJobs: recentJobs.length };
}
