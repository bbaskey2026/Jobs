import { createWorker, QUEUE_NAMES, redisConnection } from './queues/queue.factory.js';
import { processJobExpiration } from './processors/job-expiration.processor.js';
import { processAlertMatching } from './processors/alert-matching.processor.js';
import { processSourceSync } from './processors/source-sync.processor.js';
import { processRetentionCleanup } from './processors/cleanup.processor.js';
import { setupScheduledJobs } from './schedulers/cron.scheduler.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';

async function startWorker() {
  logger.info('Initializing JobPulse BullMQ Background Worker Service...');

  // 1. Initialize Workers for Queues
  const expirationWorker = createWorker(QUEUE_NAMES.JOB_EXPIRATION, async () => {
    return await processJobExpiration();
  });

  const alertWorker = createWorker(QUEUE_NAMES.ALERT_MATCHING, async (job) => {
    return await processAlertMatching(job.data);
  });

  const syncWorker = createWorker(QUEUE_NAMES.SOURCE_SYNC, async (job) => {
    return await processSourceSync(job.data);
  });

  const cleanupWorker = createWorker(QUEUE_NAMES.CLEANUP, async () => {
    return await processRetentionCleanup();
  });

  // 2. Schedule recurring cron jobs
  await setupScheduledJobs();

  logger.info(`JobPulse Worker active and listening on BullMQ queues [Concurrency: ${env.CONCURRENCY}]`);

  // 3. Graceful shutdown handler
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down worker gracefully...`);
    await Promise.all([
      expirationWorker.close(),
      alertWorker.close(),
      syncWorker.close(),
      cleanupWorker.close()
    ]);
    await redisConnection.quit();
    logger.info('Worker queues closed and Redis connection terminated.');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startWorker().catch((err) => {
  logger.error({ err }, 'Fatal error during worker bootstrap');
  process.exit(1);
});
