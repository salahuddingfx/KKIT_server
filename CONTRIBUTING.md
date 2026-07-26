# Contributing to KKIT

Thank you for your interest in contributing to KKIT! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## How to Contribute

### 🐛 Reporting Bugs

Before opening an issue:

1. Search existing [issues](https://github.com/kkitbd) to avoid duplicates
2. Use the **Bug Report** template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behaviour
   - Screenshots if applicable
   - OS, browser, Node.js version

### 💡 Suggesting Features

1. Open a **Feature Request** issue
2. Describe the problem your feature solves
3. Provide examples or mockups if possible
4. Discuss before starting implementation

### 🔧 Submitting a Pull Request

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. **Make your changes** following the code style guidelines below
4. **Write/update tests** if applicable
5. **Commit** using conventional commits:
   ```bash
   git commit -m "feat: add course rating system"
   git commit -m "fix: resolve payment callback error"
   git commit -m "docs: update API reference"
   git commit -m "refactor: simplify auth middleware"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
7. Open a **Pull Request** against the `main` branch

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code style (no logic change) |
| `refactor:` | Code refactoring |
| `test:` | Add/update tests |
| `chore:` | Build, CI, tooling |
| `perf:` | Performance improvement |

---

## Code Style

### General

- Use **2 spaces** for indentation
- Use **single quotes** in JavaScript/TypeScript
- Add **JSDoc comments** for exported functions
- Keep files **under 300 lines** — split if larger
- Avoid `console.log` in production code; use proper logging

### JavaScript / Node.js (server)

- `"use strict"` at top of every file
- Use `async/await` over callbacks or raw Promises
- Always handle errors with `try/catch` or pass to `next(err)`
- Use Zod for all input validation

### TypeScript / Next.js (client)

- Prefer explicit types over `any`
- Use `interface` for object shapes
- Use `type` for unions/intersections
- Components go in `/components`, hooks in `/hooks`
- Use `"use client"` only when necessary

---

## Branch Naming

```
feat/description        → New feature
fix/description         → Bug fix
docs/description        → Documentation
refactor/description    → Refactoring
chore/description       → Maintenance
```

---

## PR Review Process

1. A maintainer will review within **48–72 hours**
2. Changes may be requested — please address them promptly
3. Once approved, a maintainer will merge the PR
4. We squash commits on merge for a clean history

---

## Development Setup

### Client

```bash
git clone https://github.com/kkitbd/client-kkitbd.git
cd client-kkitbd
pnpm install
cp .env.local.example .env.local
pnpm dev
```

### Server

```bash
git clone https://github.com/kkitbd/server.git
cd server
npm install
cp .env.example .env
npm run dev
```

---

## Questions?

Open a [Discussion](https://github.com/kkitbd) or reach out at **dev@kkitbd.com**.

Thank you for contributing! 🚀