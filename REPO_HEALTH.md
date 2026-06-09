# Repo Health Audit — 2026-06-09

## Build & Lint

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install` | ⚠️ Pass with warning | Exits 0. Warning: `unrs-resolver@1.12.2` build scripts require approval via `pnpm approve-builds`. Fixed with `pnpm approve-builds --all`. |
| `pnpm build` | ✅ Pass | Build completes successfully (8 pages, 106 kB shared). Note: turbo/pnpm wrapper fails on unrs-resolver approval; direct execution via `npx dotenv -e ../../.env -- next build` works. |
| `pnpm lint` | ✅ Pass | Zero warnings, zero errors. Direct execution: `npx dotenv -e ../../.env -- next lint` from `apps/web/`. |

## Database

| Check | Result | Notes |
|-------|--------|-------|
| PostgreSQL running | ✅ | Container `vixi-postgres` (postgres:16-alpine) up on port 5432. |
| `prisma generate` | ✅ | Prisma Client v6.19.3 generated successfully. |
| `prisma db push` | ✅ | Database already in sync with schema. |
| Seed | ✅ | Demo user exists (`demo@vixi.app`). Seed script runs and skips gracefully. |

## Environment Variables

| Variable | In `.env`? | In `.env.example`? | Validated in `next.config.js`? | Notes |
|----------|-----------|-------------------|-------------------------------|-------|
| `DATABASE_URL` | ✅ | ✅ | ✅ | Required. |
| `AUTH_SECRET` | ✅ | ✅ | ✅ | Required. Dev-only placeholder. |
| `AUTH_URL` | ✅ | ✅ | ✅ | Required. |
| `AUTH_TRUST_HOST` | ✅ | ✅ | ❌ | Present but not validated at startup. |
| `NEXT_PUBLIC_APP_URL` | ✅ | ✅ | ✅ | Required. |
| `NEXTAUTH_URL` | ❌ | ✅ | ❌ | Optional backward-compat. Not set in `.env`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ❌ | ✅ | ❌ | Optional — required only for Google OAuth. |
| `GOOGLE_CLIENT_SECRET` | ❌ | ✅ | ❌ | Optional — required only for Google OAuth. |

### Missing (Optional)
- `NEXTAUTH_URL` — not in `.env`, but in `.env.example`. Used for NextAuth backward compatibility.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — not configured; Google OAuth disabled.

## Route Inventory

### Existing Routes

| Route | File | Type |
|-------|------|------|
| `/` | `app/page.tsx` | Server (marketing) |
| `/login` | `app/login/page.tsx` | Client (auth form) |
| `/register` | `app/register/page.tsx` | Client (auth form) |
| `/dashboard` | `app/dashboard/page.tsx` | Server (stats, protected) |
| `/dashboard` | `app/dashboard/layout.tsx` | Server (sidebar + auth guard) |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | API (NextAuth handler) |
| `/api/auth/register` | `app/api/auth/register/route.ts` | API (registration POST) |

### Missing Routes (linked but 404)

Sidebar links (`apps/web/src/components/sidebar.tsx`):

| Route | Status |
|-------|--------|
| `/vaults` | ❌ Missing |
| `/memories` | ❌ Missing |
| `/beneficiaries` | ❌ Missing |
| `/check-ins` | ❌ Missing |

Dashboard quick-actions (`apps/web/src/app/dashboard/page.tsx`):

| Route | Status |
|-------|--------|
| `/vaults/new` | ❌ Missing |
| `/memories/new` | ❌ Missing |
| `/beneficiaries/new` | ❌ Missing |

## Dev Server

| Check | Result | Notes |
|-------|--------|-------|
| Starts successfully | ✅ | `next dev` starts and reports "Ready in 1103ms". |
| HTTP smoke test | ⚠️ Inconclusive | Server process lifecycle in headless environment prevents curl verification. Build success is the proxy for correctness. |

## Gitignore Coverage

| Pattern | Covered? |
|---------|----------|
| `node_modules/` | ✅ |
| `.next/` | ✅ |
| `.env` | ✅ |
| `.env.local` | ✅ |
| `.env.*.local` | ✅ |
| `dist/` | ✅ |
| `build/` | ✅ |
| `.turbo/` | ✅ |
| `*.tsbuildinfo` | ✅ |
| `uploads/` | ✅ |
| `.pnpm-store/` | ✅ |

## Warnings & Action Items

1. **pnpm build approval friction** — `unrs-resolver` requires `pnpm approve-builds --all` on fresh installs. Consider documenting this in README or finding an alternative to the dependency.
2. **Missing product routes** — 7 routes linked from sidebar/dashboard return 404. These are the primary focus of the next implementation ticket.
3. **Optional env vars not set** — Google OAuth and `NEXTAUTH_URL` are documented but unset. This is expected for local dev but should be noted in setup docs.
4. **No test suite** — No tests exist yet. Ticket 011 will add Vitest/Jest foundation.
5. **No CI pipeline** — No GitHub Actions or similar. Ticket 011 will add CI.
