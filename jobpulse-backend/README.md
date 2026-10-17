# JobPulse REST API (Backend)

Production-ready backend API service for **JobPulse** — India's verified government and private job discovery and alert platform.

## Features
- **Prisma ORM & PostgreSQL**: Enterprise relational schema with foreign keys, indexes, cascades, and migrations.
- **Argon2id Authentication**: Secure password hashing with RFC 9106 recommended parameters.
- **JWT & HTTP-Only Cookies**: Dual support for browser sessions and programmatic API calls.
- **Role-Based Access Control**: `JOB_SEEKER`, `RECRUITER`, `MODERATOR`, and `ADMIN` roles.
- **Deadlines & Lifecycle**: Automatic status filtering and deadline enforcement.
- **NoAuth Integration Layer**: Dedicated provider client, schema validator, mapper, and rate limit handler.
- **Storage Adapter**: Local and object storage support with randomized storage keys for resumes.
- **Email Dispatch**: Console simulator for local development and SMTP adapter for production.
- **Swagger / OpenAPI**: Interactive API documentation at `/api/docs`.
- **Structured Logging**: High-performance JSON logging with Pino.

## Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- PostgreSQL 14+
- Redis (optional, for BullMQ queues)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your database connection:
```bash
cp .env.example .env
```

### 3. Database Generation & Seed
```bash
# Generate Prisma Client
npm run prisma:generate

# Run Migrations
npm run prisma:migrate

# Seed Verified Organizations & Labeled Demo Postings
npm run prisma:seed
```

### 4. Running the API
```bash
# Development (with auto-reload)
npm run dev

# Production Build & Run
npm run build
npm start
```

### 5. Running Tests
```bash
npm test
```

### API Documentation
Visit `http://localhost:5000/api/docs` in your browser when the server is running.
