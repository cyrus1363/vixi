# Vixi

A legacy planning, after-life preparation, memory preservation, and beneficiary notification platform.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind CSS + TypeScript
- **Backend**: Next.js API routes + Prisma ORM + PostgreSQL 16
- **Auth**: Auth.js v5 (NextAuth) — credentials + Google OAuth
- **UI**: lucide-react icons, shared `@vixi/ui` package
- **Package Manager**: pnpm 11.5.2

## Features

- **Vaults** — Secure containers for important documents, wills, insurance, financial info, digital assets, and messages
- **Memories** — Preserve stories, photos, and reflections for future generations
- **Beneficiaries** — Designate trusted (or standard) people to receive your legacy
- **Check-ins** — Scheduled reminders to confirm you're still in control of your account
- **Auth** — Email/password or Google sign-in
- **Dashboard** — Overview of your legacy plan with quick actions

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 11.5.2
- Podman (or Docker)

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
podman compose up -d

# Push database schema
pnpm db:push

# (Optional) Seed demo data
pnpm db:seed
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server (Next.js on :3000) |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run ESLint across the workspace |
| `pnpm test` | Run Vitest unit tests (in `apps/web`) |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:seed` | Seed demo data (demo@vixi.app / demo1234) |

### Demo Account

After seeding, log in with:
- **Email**: `demo@vixi.app`
- **Password**: `demo1234`

## Project Structure

```
├── apps/
│   └── web/                 # Next.js application
│       ├── src/app/         # App Router pages + API routes
│       ├── src/components/  # Reusable UI components
│       └── src/lib/         # Auth, services, validations, errors
├── packages/
│   ├── auth/                # Auth.js v5 config + NextAuth instance
│   ├── db/                  # Prisma schema + client
│   └── ui/                  # Shared UI components (Button, cn util)
├── docker-compose.yml       # PostgreSQL container
├── new_plan.md              # Active implementation roadmap
└── turbo.json               # Turborepo pipeline
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for JWT signing (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Your app URL (for auth redirects) |
| `AUTH_TRUST_HOST` | Set `true` for non-localhost deploys |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |

## Architecture Notes

- **User-scoped services** — All database queries are scoped to the authenticated user via `userId` parameter. Cross-user access is prevented by using `findFirst({ where: { id, userId } })` rather than `findUnique`.
- **Strict validation** — All incoming data is validated with Zod schemas (`.strict()` to reject unknown fields).
- **Type-safe errors** — `NotFoundError` and `ValidationError` provide structured error handling.
- **Auth middleware** — `requireAuth()` redirects unauthenticated users to `/login`.
- **Conditional OAuth** — Google provider is only registered when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

## Testing

47 unit tests cover all four validation schemas (vault, memory, beneficiary, check-in):

```bash
cd apps/web && npx vitest run
```

## License

Private.
