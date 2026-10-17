import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../../database/prisma.js';
import { checkNoAuthHealth } from '../../integrations/noauth/noauth.health.js';

const router = Router();

// Liveness probe
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Readiness probe checking DB and external providers
router.get('/readiness', async (_req: Request, res: Response) => {
  const dbConnected = await checkDatabaseConnection();
  const noAuthHealth = await checkNoAuthHealth();

  const isReady = dbConnected;

  const responsePayload = {
    status: isReady ? 'ready' : 'degraded',
    checks: {
      database: {
        status: dbConnected ? 'healthy' : 'unhealthy'
      },
      providerNoAuth: {
        status: noAuthHealth.isHealthy ? 'healthy' : 'pending_configuration',
        message: noAuthHealth.message
      }
    },
    timestamp: new Date().toISOString()
  };

  res.status(isReady ? 200 : 503).json(responsePayload);
});

export default router;
