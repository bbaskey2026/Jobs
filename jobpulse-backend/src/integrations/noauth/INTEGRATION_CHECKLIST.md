# NoAuth Job Provider Integration Checklist

As mandated by Section 8 of the prompt, NoAuth endpoints and credentials are not invented. The adapter is fully scaffolded, typed, tested, and marked pending until official credentials and documentation are supplied.

## Pending Requirements from Project Owner
1. [ ] **Official API Base URL**: Verify whether `NOAUTH_API_BASE_URL` is production or sandbox.
2. [ ] **Authentication Scheme**: Verify header name (e.g. `Authorization: Bearer <key>`, `x-api-key: <key>`, or basic auth).
3. [ ] **Endpoint Contract**: Confirm whether endpoint is `/jobs`, `/vacancies`, or feed-based.
4. [ ] **Pagination Strategy**: Confirm cursor vs page/limit parameters and payload structure.
5. [ ] **Rate Limits & Quotas**: Document queries per minute/hour permitted.
6. [ ] **Terms & Data Licensing**: Confirm redistribution and retention rights for job postings.

## Activation Steps
1. Set `NOAUTH_ENABLED=true` in `.env`.
2. Populate `NOAUTH_API_BASE_URL` and `NOAUTH_API_KEY`.
3. Run integration test: `npm test tests/unit/noauth.test.ts`.
4. Trigger worker sync in admin dashboard: `POST /api/v1/admin/sources/sync`.
