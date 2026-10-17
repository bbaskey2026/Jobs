import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { requestIdMiddleware, requestLoggerMiddleware } from './middleware/logger.middleware.js';
import { errorHandlerMiddleware } from './middleware/error.middleware.js';
import { AppError } from './utils/errors.js';
import { swaggerDocument } from './docs/swagger.js';

// Route modules
import authRoutes from './modules/auth/auth.routes.js';
import jobsRoutes from './modules/jobs/jobs.routes.js';
import organizationsRoutes from './modules/organizations/organizations.routes.js';
import categoriesRoutes from './modules/job-categories/categories.routes.js';
import bookmarksRoutes from './modules/bookmarks/bookmarks.routes.js';
import savedSearchesRoutes from './modules/saved-searches/saved-searches.routes.js';
import alertsRoutes from './modules/job-alerts/alerts.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import applicationsRoutes from './modules/applications/applications.routes.js';
import resumesRoutes from './modules/resumes/resumes.routes.js';
import profilesRoutes from './modules/profiles/profiles.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import healthRoutes from './modules/health/health.routes.js';

export function createApp(): Express {
  const app = express();

  // 1. Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // 2. CORS configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
    })
  );

  // 3. Body parsing & cookies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // 4. Request context & logging
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // 5. API Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // 6. Mount business routes under /api/v1
  const v1 = express.Router();
  v1.use('/health', healthRoutes);
  v1.use('/auth', authRoutes);
  v1.use('/jobs', jobsRoutes);
  v1.use('/organizations', organizationsRoutes);
  v1.use('/categories', categoriesRoutes);
  v1.use('/bookmarks', bookmarksRoutes);
  v1.use('/saved-searches', savedSearchesRoutes);
  v1.use('/alerts', alertsRoutes);
  v1.use('/notifications', notificationsRoutes);
  v1.use('/applications', applicationsRoutes);
  v1.use('/resumes', resumesRoutes);
  v1.use('/profile', profilesRoutes);
  v1.use('/admin', adminRoutes);

  app.use(env.API_PREFIX, v1);

  // Root welcome route
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'JobPulse REST API',
      version: '1.0.0',
      market: 'India',
      docs: '/api/docs',
      health: `${env.API_PREFIX}/health`
    });
  });

  // 7. Not Found Handler
  app.use((req: Request, _res: Response, next) => {
    next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
  });

  // 8. Centralized Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
