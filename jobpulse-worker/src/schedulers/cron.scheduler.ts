import { createQueue, QUEUE_NAMES } from '../queues/queue.factory.js';
import { logger } from '../utils/logger.js';

export async function setupScheduledJobs() {
  logger.info('Registering BullMQ scheduled repeatable jobs...');

  const expirationQueue = createQueue(QUEUE_NAMES.JOB_EXPIRATION);
  const syncQueue = createQueue(QUEUE_NAMES.SOURCE_SYNC);
  const cleanupQueue = createQueue(QUEUE_NAMES.CLEANUP);

  try {
    // 1. Job Expiration Sweep: Every hour
    await expirationQueue.add(
      'hourly-job-expiration',
      {},
      {
        repeat: { pattern: '0 * * * *' },
        jobId: 'repeatable-hourly-job-expiration'
      }
    );

    // 2. Job Source Synchronization: Every 30 minutes
    await syncQueue.add(
      'periodic-source-sync',
      { sourceCode: 'OFFICIAL_UPSC' },
      {
        repeat: { pattern: '*/30 * * * *' },
        jobId: 'repeatable-source-sync'
      }
    );

    // 3. Retention & Cleanup: Daily at 02:00 AM
    await cleanupQueue.add(
      'daily-retention-cleanup',
      {},
      {
        repeat: { pattern: '0 2 * * *' },
        jobId: 'repeatable-daily-cleanup'
      }
    );

    logger.info('Repeatable scheduled background tasks registered with BullMQ.');
  } catch (err: any) {
    logger.warn({ err: err.message }, 'Could not register repeatable jobs (Redis may be offline or in local fallback)');
  }
}
