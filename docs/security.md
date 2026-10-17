# JobPulse Security Architecture

## 1. Authentication & Password Security
- **Argon2id Hashing**: Uses `argon2` implementation with high memory cost (64MB) and multiple iterations. Plaintext passwords are never logged or stored.
- **HTTP-Only Cookies**: JWT tokens delivered via secure HTTP-only cookies with `SameSite=Lax` and explicit domain bindings.
- **Account Enumeration Defense**: Forgot password and verification flows return generic neutral success responses to avoid exposing account existence.

## 2. API & Network Defenses
- **Helmet**: Sets secure HTTP response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
- **CORS Allowlist**: Explicit allowed origin checking preventing arbitrary web origins from issuing authenticated cross-site mutations.
- **Input Validation**: 100% of incoming payloads strictly validated at boundary using Zod schemas.

## 3. Storage & Resume Privacy
- **Randomized Storage Keys**: Uploaded resumes stored using cryptographic randomized tokens (`randomBytes(16)`), eliminating guessable URL enumerations.
- **MIME & File Signature Enforcement**: Only PDF and Word documents allowed; strict 5MB size limit enforced at buffer ingestion.
- **Access Control**: Download endpoints verify user ownership before streaming file streams.
