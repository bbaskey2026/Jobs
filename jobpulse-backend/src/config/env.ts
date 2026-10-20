import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const booleanFromString = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true' || val === '1') return true;
    if (val.toLowerCase() === 'false' || val === '0') return false;
  }
  return Boolean(val);
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  REFRESH_TOKEN_SECRET: z.string().min(16, 'REFRESH_TOKEN_SECRET must be at least 16 chars'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('jobpulse_cookie_secret_key_min_32_chars!'),
  COOKIE_SECURE: booleanFromString.default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./uploads/resumes'),
  STORAGE_MAX_FILE_SIZE_BYTES: z.coerce.number().default(5242880),
  EMAIL_DRIVER: z.enum(['console', 'smtp']).default('console'),
  SMTP_HOST: z.string().optional().default('localhost'),
  SMTP_PORT: z.coerce.number().optional().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('alerts@jobpulse.in'),
  EMAIL_FROM_NAME: z.string().default('JobPulse Alerts'),
  NOAUTH_API_BASE_URL: z.string().url().default('https://api.noauth.example.com/v1'),
  NOAUTH_API_KEY: z.string().optional().default(''),
  NOAUTH_API_TIMEOUT_MS: z.coerce.number().default(10000),
  NOAUTH_ENABLED: booleanFromString.default(false),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
