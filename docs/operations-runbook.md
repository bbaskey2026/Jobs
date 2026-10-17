# JobPulse Operations Runbook

## Operational Troubleshooting & Diagnostic Procedures

### 1. Database Connection Failures
- **Symptom**: `Database ping failed. Ensure PostgreSQL is running.` or HTTP 503 on `/api/v1/health/readiness`.
- **Diagnosis**:
  1. Check PostgreSQL service status: `Get-Service -Name *postgres*`.
  2. Verify credentials in `.env` (`DATABASE_URL`).
  3. Verify port 5432 is listening: `Get-NetTCPConnection -LocalPort 5432`.
- **Mitigation**: Restart PostgreSQL service or verify network credentials.

### 2. External Provider Sync Retries & Circuit Breaking
- **Symptom**: `JobSourceRun` marked with status `FAILED` or consecutive failures increasing.
- **Diagnosis**:
  1. Inspect `jobpulse-backend/src/integrations/noauth/INTEGRATION_CHECKLIST.md`.
  2. Check provider health endpoint: `GET /api/v1/health/readiness`.
  3. Inspect rate limit response headers (HTTP 429).
- **Mitigation**: Adjust `NOAUTH_API_TIMEOUT_MS` or verify provider API key validity.

### 3. Background Queue & BullMQ
- **Symptom**: Deadlines not transitioning to expired or job alerts delayed.
- **Diagnosis**:
  1. Verify Redis is running on port 6379.
  2. Check worker logs: `npm run dev` in `jobpulse-worker`.
- **Mitigation**: Restart the standalone worker service.
