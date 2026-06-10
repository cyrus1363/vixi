# Local Development

## Prerequisites

- Node.js 20+
- pnpm 11.5.2 — `npm install -g pnpm@11.5.2`
- Docker or Podman (for PostgreSQL)

## First-time setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env file and fill in AUTH_SECRET
cp .env.example .env
# Generate AUTH_SECRET:
openssl rand -base64 32

# 3. Start PostgreSQL
docker-compose up -d

# 4. Generate Prisma client, push schema, seed demo data
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Start dev server
pnpm dev
```

Open http://localhost:3000

## Demo login

After seeding: **demo@vixi.app / demo1234**

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start all apps (Turborepo) |
| `pnpm build` | Production build |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run Vitest (from `apps/web/`) |
| `pnpm db:migrate` | Create + apply a new Prisma migration |
| `pnpm db:studio` | Open Prisma Studio at http://localhost:5555 |
| `pnpm db:seed` | Seed demo user (idempotent) |

## Google OAuth (optional)

Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`. If unset, the Google button is hidden — credentials login still works.

## Troubleshooting

- **`Missing required environment variable` on startup** — copy `.env.example` to `.env` and fill in all values
- **`pnpm db:push` fails** — check Docker is running (`docker ps`) and `DATABASE_URL` matches `docker-compose.yml` credentials (`vixi:vixi@localhost:5432/vixi`)
- **Port 5432 already in use** — stop any local Postgres, or change the port in both `docker-compose.yml` and `DATABASE_URL`
