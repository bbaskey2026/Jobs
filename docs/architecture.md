# JobPulse System Architecture

## 1. System Overview
JobPulse is an enterprise-grade government and private job discovery and alert platform built for users in India. The platform is architected across 4 decoupled, independently runnable repositories:

```
c:\jobsearch\
├── jobpulse-shared/       # Shared TypeScript contracts, enums, constants, domain types
├── jobpulse-backend/      # Express.js REST API with Prisma, PostgreSQL, Argon2, Swagger
├── jobpulse-frontend/     # React + Vite + Material UI + TanStack Query + Formik SPA
├── jobpulse-worker/       # BullMQ + Redis background worker for ingestion, alerts, digests
├── infrastructure/        # Docker and deployment scripts
└── docs/                  # Architecture, database, security, and operational runbooks
```

## 2. Component Architecture
```mermaid
graph TD
    Client[Web Browser / Mobile View] -->|HTTP / REST| Frontend[jobpulse-frontend (Vite + React)]
    Frontend -->|API calls with Cookies / JWT| Backend[jobpulse-backend (Express.js)]
    Backend -->|Read / Write| Postgres[(PostgreSQL 16 DB)]
    Backend -->|Enqueue Jobs| Redis[(Redis 7)]
    Worker[jobpulse-worker (BullMQ)] -->|Consume Jobs| Redis
    Worker -->|Sync & Expire| Postgres
    Worker -->|Send Emails / Digests| EmailService[Email Adapter (SMTP / Console)]
    Backend -->|Resilient Fetch & Map| NoAuth[External Job Source / NoAuth API]
```

## 3. Technology Matrix
- **Language**: TypeScript strict mode across all services
- **Database**: PostgreSQL with Prisma ORM
- **Queue & Cache**: BullMQ with Redis
- **Security**: Argon2id password hashing, Helmet, HTTP-only SameSite cookies, CSRF defenses
- **Frontend**: React 18, Vite, MUI custom theme, TanStack Query v5, Zustand, Formik + Yup, Recharts
