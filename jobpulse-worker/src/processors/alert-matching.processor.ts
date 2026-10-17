import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export async function processAlertMatching(jobData: { jobId: string }) {
  const { jobId } = jobData;
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { organization: true }
  });

  if (!job || job.status !== 'PUBLISHED') {
    return { matchedAlerts: 0 };
  }

  logger.info({ jobId, title: job.title }, 'Matching job against active user alert preferences');

  // Fetch active alerts
  const activeAlerts = await prisma.jobAlert.findMany({
    where: { isActive: true },
    include: { user: true }
  });

  let matchCount = 0;

  for (const alert of activeAlerts) {
    // 1. Sector filter
    if (alert.sector && alert.sector !== job.sector) {
      continue;
    }

    // 2. State filter
    if (alert.state && alert.state !== 'All India' && !job.isAllIndia && job.state !== alert.state) {
      continue;
    }

    // 3. Keyword filter
    if (alert.keywords) {
      const term = alert.keywords.toLowerCase();
      const titleMatches = job.title.toLowerCase().includes(term);
      const summaryMatches = job.summary.toLowerCase().includes(term);
      const orgMatches = job.organization.name.toLowerCase().includes(term);

      if (!titleMatches && !summaryMatches && !orgMatches) {
        continue;
      }
    }

    // Check if user has already received an alert for this job
    const alreadyDelivered = await prisma.notificationDelivery.findFirst({
      where: {
        alertId: alert.id,
        userId: alert.userId,
        payload: {
          path: ['jobId'],
          equals: job.id
        }
      }
    });

    if (alreadyDelivered) {
      continue;
    }

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        userId: alert.userId,
        title: `Job Alert Match: ${alert.title}`,
        message: `${job.title} at ${job.organization.name} has been verified and published.`,
        linkUrl: `/jobs/${job.slug}`,
        type: 'JOB_ALERT'
      }
    });

    // Record Delivery
    await prisma.notificationDelivery.create({
      data: {
        alertId: alert.id,
        userId: alert.userId,
        channel: alert.channels[0] || 'EMAIL',
        status: 'DELIVERED',
        payload: {
          jobId: job.id,
          jobTitle: job.title,
          organization: job.organization.name
        }
      }
    });

    // Update alert last delivered timestamp
    await prisma.jobAlert.update({
      where: { id: alert.id },
      data: { lastDeliveredAt: new Date() }
    });

    matchCount++;
  }

  logger.info({ jobId, matchCount }, 'Alert matching completed');
  return { matchedAlerts: matchCount };
}
