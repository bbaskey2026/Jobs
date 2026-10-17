import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma, checkDatabaseConnection } from './database/prisma.js';

async function bootstrap() {
  const app = createApp();

  const isDbReady = await checkDatabaseConnection();
  if (isDbReady) {
    logger.info('Database connection established successfully.');
  } else {
    logger.warn('Initial database ping failed. Ensure PostgreSQL is running.');
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`JobPulse Backend Server running on port ${env.PORT} (${env.NODE_ENV})`);
    logger.info(`API Base: http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`Swagger Docs: http://localhost:${env.PORT}/api/docs`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await prisma.$disconnect();
      logger.info('Database disconnected.');
      process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing process exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Fatal error during server bootstrap');
  process.exit(1);
});
