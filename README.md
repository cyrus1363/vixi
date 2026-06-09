# Vixi

A legacy planning, after-life preparation, memory preservation, and beneficiary notification platform.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind CSS + TypeScript
- **Backend**: Next.js API routes + Prisma ORM + PostgreSQL 16
- **Auth**: Auth.js v5 (NextAuth) — credentials + Google OAuth
- **Package Manager**: pnpm 11.5.2

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
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:seed` | Seed demo data (demo@vixi.app / demo1234) |

### Demo Account

After seeding, you can log in with:
- **Email**: `demo@vixi.app`
- **Password**: `demo1234`

## Project Structure

```
├── apps/web/          # Next.js application
├── packages/
│   ├── auth/          # Auth.js configuration
│   ├── db/            # Prisma schema + client
│   └── ui/            # Shared UI components
├── docker-compose.yml # PostgreSQL container
└── turbo.json         # Turborepo pipeline
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for JWT signing |
| `AUTH_URL` | Your app URL (for auth redirects) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |
