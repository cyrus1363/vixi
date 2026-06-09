# Vixi — Project Initialization & Base App Shell (Ticket 001)

## Project Overview

Vixi is a legacy planning, after-life preparation, memory preservation, and beneficiary notification platform. This plan covers the initial project scaffolding and base application shell.

**Tech Stack:** Turborepo (pnpm workspaces) · Next.js 15 App Router · TypeScript · PostgreSQL 16 · Prisma ORM · Auth.js v5 (NextAuth) · Tailwind CSS · pnpm 11.5.2

---

## Current State (What's Already Done)

### Root Configuration
- [x] `package.json` — root workspace with turbo, prettier, eslint, typescript
- [x] `pnpm-workspace.yaml` — packages defined, build deps approved
- [x] `turbo.json` — pipeline with build/dev/lint/clean tasks
- [x] `tsconfig.json` — base TS config (ES2022, bundler resolution, strict)
- [x] `.gitignore` — node_modules, .next, .env, dist, .turbo, etc.
- [x] `.env` — DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL
- [x] `.env.example` — template for env vars
- [x] `docker-compose.yml` — PostgreSQL 16 Alpine container

### Package: `@vixi/db` (packages/db)
- [x] `package.json` — prisma client, bcryptjs, tsx, prisma CLI
- [x] `tsconfig.json` — extends root, NodeNext module
- [x] `prisma/schema.prisma` — full MVP schema:
  - User (with role enum: USER/ADMIN)
  - Account, Session, VerificationToken (Auth.js compat)
  - Vault (with type enum: GENERAL/WILL/INSURANCE/FINANCIAL/DIGITAL_ASSETS/MESSAGES, status enum: ACTIVE/SEALED/UNLOCKED)
  - VaultContent (polymorphic content with JSON metadata)
  - Beneficiary (with trusted/notified flags)
  - Memory (with tags array)
  - CheckIn (with status enum: PENDING/RESPONDED/MISSED/ESCALATED)
- [x] `src/client.ts` — singleton PrismaClient (global caching for dev)
- [x] `src/seed.ts` — demo user + vault + beneficiary + memory

### Package: `@vixi/auth` (packages/auth)
- [x] `package.json` — next-auth, @auth/prisma-adapter, bcryptjs, zod
- [x] `tsconfig.json` — extends root, NodeNext module
- [x] `src/config.ts` — NextAuthConfig with:
  - PrismaAdapter
  - JWT session strategy
  - Credentials provider (email/password with bcrypt compare)
  - Google OAuth provider (with allowDangerousEmailAccountLinking)
  - JWT callback (injects id + role into token)
  - Session callback (injects id + role into session)
  - Custom pages: /login, /register
- [x] `src/index.ts` — re-exports authConfig

### Package: `@vixi/ui` (packages/ui)
- [x] `package.json` — class-variance-authority, clsx, tailwind-merge
- [x] `tsconfig.json` — extends root, jsx: react-jsx, NodeNext module
- [x] `src/utils.ts` — cn() utility (clsx + twMerge)
- [x] `src/button.tsx` — Button component with variants (default/destructive/outline/secondary/ghost/link) and sizes (default/sm/lg/icon), supports asChild prop for Link wrapping

### App: `@vixi/web` (apps/web)
- [x] `package.json` — next 15.1.0, react 19, next-auth beta, react-hook-form, zod, tailwindcss 3
- [x] `next.config.js` — transpilePackages for workspace packages
- [x] `tsconfig.json` — extends root, Bundler resolution, @/ path alias
- [x] `tailwind.config.ts` — custom vixi color palette (teal/gold/cream/sand/dark/stone), Geist font
- [x] `postcss.config.mjs` — tailwindcss + autoprefixer
- [x] `src/app/globals.css` — Tailwind directives, base body styles
- [x] `src/app/layout.tsx` — RootLayout with Geist font, metadata
- [x] `src/app/page.tsx` — Landing page with hero, CTA buttons, nav
- [x] `src/app/login/page.tsx` — Login form (credentials + Google), error state, loading state
- [x] `src/app/register/page.tsx` — Registration form (name/email/password), error state, loading state
- [x] `src/app/dashboard/layout.tsx` — Auth-protected layout with Sidebar
- [x] `src/app/dashboard/page.tsx` — Dashboard with stats cards (vaults/beneficiaries/memories counts) + quick actions
- [x] `src/components/sidebar.tsx` — Client-side nav sidebar with active state, sign out
- [x] `src/lib/auth.ts` — getSession(), requireAuth(), requireGuest() helpers
- [x] `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route handler
- [x] `src/app/api/auth/register/route.ts` — Registration API (Zod validation, duplicate check, bcrypt hash)

### Dependencies Installed
- [x] `pnpm install` completed
- [x] `pnpm rebuild` completed (build scripts for prisma/esbuild/sharp)
- [x] `prisma generate` completed (Prisma Client v6.19.3 generated)

---

## Remaining Work (What Needs to Be Done)

### Phase 1: Database & Infrastructure Setup

#### 1.1 Start PostgreSQL Container
```bash
podman compose up -d
```
- Starts PostgreSQL 16 on port 5432
- Creates `vixi` database with user `vixi` / password `vixi`

#### 1.2 Push Prisma Schema to Database
```bash
cd packages/db && pnpm db:push
```
- Creates all tables: users, accounts, sessions, verificationtokens, vaults, vault_contents, beneficiaries, memories, check_ins
- Creates all enums: UserRole, VaultType, VaultStatus, CheckInStatus

#### 1.3 Seed Demo Data (Optional)
```bash
cd packages/db && pnpm db:seed
```
- Creates demo user: `demo@vixi.app` / `demo1234`
- Creates sample vault, beneficiary, and memory

### Phase 2: Build Verification

#### 2.1 Build the Next.js App
```bash
pnpm build
```
- Verifies TypeScript compilation
- Verifies all imports resolve correctly
- Verifies Tailwind CSS compiles
- Verifies no missing dependencies

#### 2.2 Start Dev Server
```bash
pnpm dev
```
- Starts Next.js dev server on http://localhost:3000
- Verify landing page renders
- Verify login/register pages render
- Verify dashboard redirects to login (when unauthenticated)

### Phase 3: Manual Smoke Tests

#### 3.1 Registration Flow
- Navigate to /register
- Create account with name, email, password
- Verify redirect to /dashboard
- Verify dashboard shows 0 vaults, 0 beneficiaries, 0 memories

#### 3.2 Login Flow
- Sign out
- Navigate to /login
- Sign in with created credentials
- Verify redirect to /dashboard

#### 3.3 Google OAuth (if configured)
- Click "Continue with Google"
- Verify OAuth flow works
- Verify redirect to /dashboard

#### 3.4 Protected Routes
- Verify /dashboard redirects to /login when unauthenticated
- Verify /dashboard loads when authenticated
- Verify sidebar navigation items render

### Phase 4: Fix Known Issues

#### 4.1 pnpm-workspace.yaml Cleanup
- Remove the stale `allowBuilds` block (currently has placeholder values)
- Keep only `onlyBuiltDependencies` block

#### 4.2 .env.example Update
- Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` placeholders
- Add `AUTH_URL` placeholder
- Ensure consistency with actual .env

#### 4.3 README.md
- Add project description
- Add setup instructions
- Add available scripts reference

---

## File Manifest (All Files in Project)

```
.env
.env.example
.gitignore
docker-compose.yml
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
README.md
tsconfig.json
turbo.json

apps/web/
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   └── auth/
    │   │       ├── [...nextauth]/
    │   │       │   └── route.ts
    │   │       └── register/
    │   │           └── route.ts
    │   ├── dashboard/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   └── register/
    │       └── page.tsx
    ├── components/
    │   └── sidebar.tsx
    └── lib/
        └── auth.ts

packages/
├── auth/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── config.ts
│       └── index.ts
├── db/
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── client.ts
│       └── seed.ts
└── ui/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── button.tsx
        └── utils.ts
```

---

## Execution Order for Build Agent

```bash
# Step 1: Start database
podman compose up -d

# Step 2: Push schema
cd packages/db && pnpm db:push

# Step 3: Seed data (optional)
pnpm db:seed

# Step 4: Build
cd /var/home/cyrustogo/Desktop/Vixi && pnpm build

# Step 5: Dev server
pnpm dev
```
