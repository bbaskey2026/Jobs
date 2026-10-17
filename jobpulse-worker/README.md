# JobPulse Worker Service

Independently runnable background worker application for JobPulse using **Node.js, TypeScript, and BullMQ**.

## Responsibilities
- **Source Synchronization**: Ingestion and normalization of provider job feeds.
- **Deadline & Expiration Processing**: Automated sweeps transitioning past-deadline jobs to `EXPIRED`.
- **Alert Matching**: Matching newly published vacancies against user `JobAlert` rules.
- **Email Delivery**: Idempotent email alert dispatches with retry backoff.
- **Scheduled Digests**: Daily (09:00 AM) and weekly digests.
- **Data Retention & Cleanup**: Purging expired tokens, old runs, and audit logs.

## Setup & Running

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run in Development mode
npm run dev

# Run Tests
npm test

# Build & Run in Production
npm run build
npm start
```
