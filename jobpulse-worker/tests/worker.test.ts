import { describe, it, expect } from 'vitest';
import { QUEUE_NAMES } from '../src/queues/queue.factory.js';

describe('JobPulse Background Worker Configuration', () => {
  it('should define distinct queue names for all async processing domains', () => {
    expect(QUEUE_NAMES.SOURCE_SYNC).toBe('jobpulse-source-sync');
    expect(QUEUE_NAMES.JOB_EXPIRATION).toBe('jobpulse-job-expiration');
    expect(QUEUE_NAMES.ALERT_MATCHING).toBe('jobpulse-alert-matching');
    expect(QUEUE_NAMES.EMAIL_DELIVERY).toBe('jobpulse-email-delivery');
    expect(QUEUE_NAMES.CLEANUP).toBe('jobpulse-retention-cleanup');
  });

  it('should have unique queue names across domains', () => {
    const queueList = Object.values(QUEUE_NAMES);
    const uniqueQueues = new Set(queueList);
    expect(uniqueQueues.size).toBe(queueList.length);
  });
});
