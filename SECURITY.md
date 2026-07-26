# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ Active support |
| Previous releases | ⚠️ Critical fixes only |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in KKIT, please report it privately so we can address it before public disclosure.

### How to Report

**Email:** security@kkitbd.com  
**Subject:** `[SECURITY] Brief description of vulnerability`

Please include as much of the following as possible:

- **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass, IDOR, RCE)
- **Affected component** (client / server / specific endpoint)
- **Steps to reproduce** — be specific and clear
- **Proof of concept** (code, curl command, screenshots)
- **Impact assessment** — what could an attacker do?
- **Your suggested fix** (optional but appreciated)

---

## What Happens Next

1. **Acknowledgement** — We will acknowledge your report within **48 hours**
2. **Investigation** — We will investigate and determine the severity (within 5 business days)
3. **Fix Development** — We will develop a fix privately
4. **Disclosure** — We will coordinate a disclosure date with you
5. **Credit** — With your permission, we will credit you in the release notes

---

## Security Measures in Place

### Server

| Measure | Implementation |
|---------|---------------|
| Authentication | JWT with short expiry + refresh rotation |
| Password hashing | bcryptjs (12 salt rounds) |
| Rate limiting | 60 req/min (API), 10 req/min (auth), 5 req/min (forms) |
| HTTP headers | Helmet.js (CSP, HSTS, X-Frame-Options, etc.) |
| CORS | Strict whitelist |
| Input validation | Zod on all endpoints |
| Body size limit | 10MB max |
| Attack detection | SQL injection, XSS, path traversal, command injection, SSRF |
| Error handling | Sanitized error responses (no stack traces in production) |

### Client

| Measure | Implementation |
|---------|---------------|
| XSS prevention | React JSX escaping + strict CSP |
| CSRF protection | SameSite cookies |
| Dependency auditing | `pnpm audit` in CI |
| Secrets | All secrets in `.env.local` — never committed |

---

## Responsible Disclosure Policy

We follow responsible disclosure. We ask that:

- You give us reasonable time to fix the issue before public disclosure
- You do not access, modify, or delete user data
- You do not perform DoS/DDoS attacks
- You do not exploit the vulnerability beyond what is necessary for proof of concept

In return, we commit to:

- Responding promptly to your report
- Keeping you informed of progress
- Crediting you (unless you prefer anonymity)
- Not pursuing legal action against good-faith researchers

---

## Out of Scope

The following are **out of scope** for our security programme:

- Vulnerabilities in third-party dependencies (report to them directly)
- Issues in non-production / demo environments
- Theoretical vulnerabilities without working proof of concept
- Rate limiting / brute force on non-auth endpoints
- Missing security headers that are already implemented via Helmet
- Self-XSS
- Social engineering attacks

---

## Contact

📧 **security@kkitbd.com**  
🌐 **https://kkitbd.com**

Thank you for helping keep KKIT and our users safe! 🛡️