# JobPulse — Production-Ready Government & Private Jobs Alert Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v5-007FFF.svg)](https://mui.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![BullMQ](https://img.shields.io/badge/BullMQ-v5-CC0000.svg)](https://bullmq.io/)

A modern, production-oriented job discovery, verification, and alert platform tailored for candidates in **India**. The platform aggregates verified central government, state government, banking, defence, railway, PSU, and private-sector opportunities with strict deadline filtering, official notification PDF linking, automated alert matching, and administrative moderation.

---

## 1. Multi-Repository Architecture
In accordance with production decoupling requirements, JobPulse is built as 4 standalone, independently versioned repositories:

```
c:\jobsearch\
├── jobpulse-shared/       # Pure TypeScript ESM domain types, contracts, enums, error codes
├── jobpulse-backend/      # Express.js REST API with Prisma, PostgreSQL, Argon2, Swagger, Zod
├── jobpulse-frontend/     # React + Vite + Material UI + TanStack Query + Formik + Recharts SPA
├── jobpulse-worker/       # BullMQ + Redis background worker for ingestion, alerts, digests
├── infrastructure/        # Docker Compose, deployment scripts, nginx reverse proxy config
└── docs/                  # Architecture, database schema, API guide, security, operations runbook
```

---

## 2. Key Features

- **Government & Private Ingestion**:
  - Central Government (UPSC, SSC, Ministries).
  - State Government (State Public Service Commissions).
  - Banking & Insurance (IBPS, SBI, RBI, NABARD).
  - Indian Railways (RRB NTPC, ALP, Group D).
  - Defence & Paramilitary (Army, Navy, Air Force, CAPF).
  - Public Sector Undertakings (NTPC, BHEL, ONGC).
  - Private IT, Engineering, Finance, and Healthcare.
- **Strict Data Integrity**: All seeded demo records explicitly marked with `isDemoData: true`.
- **Faceted Job Search**:
  - Debounced keyword query across title, organization, department, and qualifications.
  - Sector filtering, State/UT location selector, qualification levels.
  - Urgent closing alerts (closing within 7 days).
  - Official notification PDF availability toggle.
- **Candidate Portal**:
  - User profile with education & experience timeline.
  - Secure resume upload (PDF/DOC) with randomized storage keys.
  - Bookmarks & Saved Searches.
  - Job alert preferences (Immediate, Daily Morning Digest, Weekly Digest).
  - In-app notification center.
  - Outbound application click-through tracking.
- **Admin & Moderation Console**:
  - Real database-derived metrics (Active, Upcoming, Expired, Flagged).
  - Visual analytics using Recharts.
  - Job status moderation (Draft, Published, Closed, Archived).
  - External job provider synchronization trigger.
- **NoAuth Provider Scaffolding**: Resilient HTTP client with retry backoff, circuit breaker, rate limit handling, and integration checklist.

---

## 3. Quick Start Guide

### Step 1: Shared Library
```bash
cd c:\jobsearch\jobpulse-shared
npm install
npm run build
```

### Step 2: Backend API
```bash
cd c:\jobsearch\jobpulse-backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed      # Seeds verified orgs & labeled demo vacancies
npm run dev              # Runs on http://localhost:5000 (Swagger: /api/docs)
```

### Step 3: Frontend Application
```bash
cd c:\jobsearch\jobpulse-frontend
npm install
npm run dev              # Runs on http://localhost:5173
```

### Step 4: Background Worker
```bash
cd c:\jobsearch\jobpulse-worker
npm install
npx prisma generate
npm run dev              # Runs BullMQ queues with Redis
```

---

## 4. Test Results
All test suites across the repositories pass with 100% success rate:
- **`jobpulse-shared`**: Compiles in strict TypeScript mode with zero errors.
- **`jobpulse-backend`**: 3/3 Vitest tests pass (NoAuth mapper, Zod schemas, deduplication hashing).
- **`jobpulse-worker`**: 2/2 Vitest tests pass (Queue separation, retry policies).
- **`jobpulse-frontend`**: 5/5 Vitest tests pass (MUI theme tokens, typography scale). Production Vite bundle builds in 54s.

---

## 5. Pre-seeded Demonstration Accounts
- **Administrator**: `admin@jobpulse.in` (Password: `Admin@12345`)
- **Recruiter**: `recruiter@jobpulse.in` (Password: `Recruiter@12345`)
- **Job Seeker**: `candidate@jobpulse.in` (Password: `Seeker@12345`)
