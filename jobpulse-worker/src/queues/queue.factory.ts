import { Queue, Worker, WorkerOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const redisConnection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableReadyCheck: false
});

redisConnection.on('error', (err) => {
  logger.warn({ err: err.message }, 'Worker Redis connection warning');
});

export const QUEUE_NAMES = {
  SOURCE_SYNC: 'jobpulse-source-sync',
  JOB_EXPIRATION: 'jobpulse-job-expiration',
  ALERT_MATCHING: 'jobpulse-alert-matching',
  EMAIL_DELIVERY: 'jobpulse-email-delivery',
  DIGEST_SCHEDULER: 'jobpulse-digest-scheduler',
  CLEANUP: 'jobpulse-retention-cleanup'
} as const;

export function createQueue(name: string) {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: 100,
      removeOnFail: 500
    }
  });
}

export function createWorker(
  queueName: string,
  processor: (job: any) => Promise<any>,
  options?: Partial<WorkerOptions>
) {
  const worker = new Worker(queueName, processor, {
    connection: redisConnection,
    concurrency: env.CONCURRENCY,
    ...options
  });

  worker.on('completed', (job) => {
    logger.info({ queue: queueName, jobId: job.id }, 'Job completed successfully');
  });

  worker.on('failed', (job, err) => {
    logger.error({ queue: queueName, jobId: job?.id, err: err.message }, 'Job failed');
  });

  return worker;
}
