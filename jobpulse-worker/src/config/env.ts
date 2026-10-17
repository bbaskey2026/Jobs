import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const workerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  CONCURRENCY: z.coerce.number().default(5),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info')
});

const parsed = workerEnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid worker configuration:', parsed.error.format());
  throw new Error('Worker environment validation failed');
}

export const env = parsed.data;
