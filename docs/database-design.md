# JobPulse Database Design

## 1. Relational Entity Relationship (PostgreSQL + Prisma)
The database schema consists of 19 relational entities satisfying strict foreign-key integrity, cascade deletion, unique constraints, and search indexes.

### Core Tables
1. **User**: Authentication credentials (Argon2id), roles (`JOB_SEEKER`, `RECRUITER`, `MODERATOR`, `ADMIN`), email verification tokens, and status.
2. **UserProfile**: One-to-one candidate profile with state, city, preferred sectors, skills, and resume metadata.
3. **EducationRecord & ExperienceRecord**: One-to-many normalized education degrees and employment history.
4. **Organization**: Verified recruitment authorities (e.g. UPSC, SSC, IBPS, RRB, DRDO) and private corporate employers with verification badges.
5. **JobCategory**: Classification hierarchy (Civil Services, Banking, Engineering, Railways, Defence, Teaching, Healthcare, Police).
6. **Job**: Central recruitment posting with vacancies, qualification requirements, pay scales, application start/deadline dates, official notification URLs, and deduplication hashes.
7. **JobBookmark**: Many-to-many relationship tracking user saved vacancies.
8. **JobAlert**: User alert subscriptions matching keywords, sector, state, and frequency (`IMMEDIATE`, `DAILY_DIGEST`, `WEEKLY_DIGEST`).
9. **Notification & NotificationDelivery**: User in-app notifications and delivery audit tracking.
10. **ApplicationRecord**: Tracking outbound official application portal visits and user application statuses.
11. **JobSource & JobSourceRun**: External provider ingestion sources and run logs (records fetched, ingested, updated, skipped duplicates).
12. **ReportedJob**: Candidate feedback and flagged posting moderation queue.
13. **AuditLog**: Admin and security activity trail.
