import { AppError } from '../../utils/errors.js';
import { ErrorCode } from '@jobpulse/shared';

export class NoAuthProviderError extends AppError {
  constructor(message: string, isRateLimit = false) {
    super(
      isRateLimit ? 429 : 502,
      isRateLimit ? ErrorCode.PROVIDER_RATE_LIMITED : ErrorCode.PROVIDER_UNAVAILABLE,
      `[NoAuth Provider] ${message}`
    );
  }
}
