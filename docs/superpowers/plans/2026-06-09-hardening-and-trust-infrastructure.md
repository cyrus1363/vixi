# Hardening & Trust Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the Vixi foundation (auth, server boundaries, route structure, API boilerplate) then add the trust-infrastructure schema that makes Vixi more than generic CRUD: audit log, consent gate, enriched trusted-contact model, and final wishes domain.

**Architecture:** Phase 1 makes zero schema changes — it fixes scripts, removes a dangerous auth flag, adds server-only guards, cleans up media rendering, consolidates route protection into a single `(app)` route group, and extracts repeated API boilerplate into three helpers. Phase 2 adds four additive Prisma migrations (no data loss), each followed immediately by its service wiring and UI.

**Tech Stack:** Next.js 15 App Router, Prisma 6, Auth.js v5, Zod, React Hook Form, Vitest, pnpm / Turborepo

---

## File Map

**Phase 1 — created**
- `apps/web/src/lib/api.ts` — `requireApiSession`, `parseBody`, `handleApiError`
- `apps/web/src/app/(app)/layout.tsx` — single `ProtectedLayout` for all auth-gated routes
- `docs/LOCAL_DEV.md` — local setup guide

**Phase 1 — modified**
- `package.json` (root) — `db:*` passthrough scripts + `typecheck`
- `turbo.json` — typecheck task
- `apps/web/package.json` — `typecheck` script
- `packages/auth/src/config.ts` — remove `allowDangerousEmailAccountLinking`
- `apps/web/src/lib/auth.ts` — `import "server-only"`
- `apps/web/src/lib/services/vaults.ts` — `import "server-only"`
- `apps/web/src/lib/services/memories.ts` — `import "server-only"`
- `apps/web/src/lib/services/beneficiaries.ts` — `import "server-only"`
- `apps/web/src/lib/services/check-ins.ts` — `import "server-only"`
- `apps/web/src/components/memory-card.tsx` — replace `<Image>` with external link
- `apps/web/src/app/memories/[id]/page.tsx` — replace `<Image>` with external link
- `apps/web/src/components/memory-form.tsx` — add helper text under media URL field
- All 8 API route files (4 domains × `route.ts` + `[id]/route.ts`) — use shared helpers

**Phase 1 — moved (git mv, URLs unchanged)**
- `apps/web/src/app/dashboard/` → `apps/web/src/app/(app)/dashboard/`
- `apps/web/src/app/vaults/` → `apps/web/src/app/(app)/vaults/`
- `apps/web/src/app/memories/` → `apps/web/src/app/(app)/memories/`
- `apps/web/src/app/beneficiaries/` → `apps/web/src/app/(app)/beneficiaries/`
- `apps/web/src/app/check-ins/` → `apps/web/src/app/(app)/check-ins/`

**Phase 1 — deleted**
- `apps/web/src/app/(app)/dashboard/layout.tsx` — superseded by `(app)/layout.tsx`

**Phase 2 — created**
- `packages/db/prisma/schema.prisma` — updated (four migrations)
- `apps/web/src/lib/services/audit.ts` — `logAuditEvent`
- `apps/web/src/lib/services/wishes.ts` — FinalWish CRUD + `archiveWish`
- `apps/web/src/lib/validations/wish.ts` — Zod schema
- `apps/web/src/lib/validations/__tests__/wish.test.ts`
- `apps/web/src/app/api/wishes/route.ts`
- `apps/web/src/app/api/wishes/[id]/route.ts`
- `apps/web/src/app/(app)/wishes/page.tsx`
- `apps/web/src/app/(app)/wishes/new/page.tsx`
- `apps/web/src/app/(app)/wishes/[id]/page.tsx`
- `apps/web/src/app/(app)/wishes/[id]/edit/page.tsx`
- `apps/web/src/components/wish-card.tsx`
- `apps/web/src/components/wish-form.tsx`
- `apps/web/src/components/delete-wish-button.tsx`
- `apps/web/src/app/onboarding/consent/page.tsx`
- `apps/web/src/app/api/onboarding/consent/route.ts`

**Phase 2 — modified**
- `apps/web/src/lib/services/index.ts` — export `audit`, `wishes`
- `apps/web/src/lib/validations/index.ts` — export `wish`
- `apps/web/src/lib/services/vaults.ts` — wire audit events
- `apps/web/src/lib/services/memories.ts` — wire audit events
- `apps/web/src/lib/services/beneficiaries.ts` — wire audit events + accept new fields
- `apps/web/src/lib/services/check-ins.ts` — wire audit events
- `apps/web/src/lib/validations/beneficiary.ts` — add role/accessLevel/inviteStatus
- `apps/web/src/lib/validations/__tests__/beneficiary.test.ts` — add new field tests
- `apps/web/src/components/protected-layout.tsx` — add consent gate
- `apps/web/src/components/beneficiary-form.tsx` — add three new fields
- `apps/web/src/components/beneficiary-card.tsx` — show role badge
- `apps/web/src/components/sidebar.tsx` — rename "Beneficiaries" → "Trusted Contacts", add "Wishes"

---

## Phase 1 — Foundation Hardening

### Task 1: Root scripts + typecheck

**Files:**
- Modify: `package.json` (root)
- Modify: `turbo.json`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add db passthrough scripts and typecheck to root `package.json`**

  Replace the `"scripts"` block:

  ```json
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "clean": "turbo clean",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "typecheck": "turbo typecheck",
    "db:generate": "pnpm --filter @vixi/db db:generate",
    "db:push": "pnpm --filter @vixi/db db:push",
    "db:migrate": "pnpm --filter @vixi/db db:migrate",
    "db:studio": "pnpm --filter @vixi/db db:studio",
    "db:seed": "pnpm --filter @vixi/db db:seed"
  }
  ```

- [ ] **Step 2: Add typecheck task to `turbo.json`**

  Add `"typecheck"` to the `"tasks"` object:

  ```json
  "typecheck": {
    "dependsOn": ["^typecheck"]
  }
  ```

- [ ] **Step 3: Add typecheck script to `apps/web/package.json`**

  Add to the `"scripts"` block:

  ```json
  "typecheck": "tsc --noEmit"
  ```

- [ ] **Step 4: Verify**

  ```bash
  cd /var/home/cyrustogo/Desktop/Vixi
  pnpm typecheck
  ```

  Expected: `tsc` runs in `apps/web`, exits 0 (or shows type errors if any pre-exist — fix before continuing).

- [ ] **Step 5: Commit**

  ```bash
  git add package.json turbo.json apps/web/package.json
  git commit -m "build: add root db passthrough scripts and typecheck task"
  ```

---

### Task 2: Remove `allowDangerousEmailAccountLinking`

**Files:**
- Modify: `packages/auth/src/config.ts`

- [ ] **Step 1: Remove the flag**

  In `packages/auth/src/config.ts`, find the Google provider push block (~line 51–56):

  ```ts
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    })
  );
  ```

  Change to:

  ```ts
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
  ```

- [ ] **Step 2: Verify build passes**

  ```bash
  pnpm build
  ```

  Expected: build succeeds (Google OAuth is behind an env-var guard, so no runtime change for most dev environments).

- [ ] **Step 3: Commit**

  ```bash
  git add packages/auth/src/config.ts
  git commit -m "security: remove allowDangerousEmailAccountLinking from Google OAuth"
  ```

---

### Task 3: Add `server-only` imports

**Files:**
- Modify: `apps/web/src/lib/auth.ts`
- Modify: `apps/web/src/lib/services/vaults.ts`
- Modify: `apps/web/src/lib/services/memories.ts`
- Modify: `apps/web/src/lib/services/beneficiaries.ts`
- Modify: `apps/web/src/lib/services/check-ins.ts`

- [ ] **Step 1: Add `import "server-only"` as the first line of each file**

  `apps/web/src/lib/auth.ts` — prepend:
  ```ts
  import "server-only";
  ```

  `apps/web/src/lib/services/vaults.ts` — prepend:
  ```ts
  import "server-only";
  ```

  `apps/web/src/lib/services/memories.ts` — prepend:
  ```ts
  import "server-only";
  ```

  `apps/web/src/lib/services/beneficiaries.ts` — prepend:
  ```ts
  import "server-only";
  ```

  `apps/web/src/lib/services/check-ins.ts` — prepend:
  ```ts
  import "server-only";
  ```

- [ ] **Step 2: Verify build still passes**

  ```bash
  pnpm build
  ```

  Expected: build succeeds. If any client component accidentally imports a service, Next.js will now fail the build with "You're importing a component that needs server-only" — fix that import if it appears.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/lib/auth.ts \
    apps/web/src/lib/services/vaults.ts \
    apps/web/src/lib/services/memories.ts \
    apps/web/src/lib/services/beneficiaries.ts \
    apps/web/src/lib/services/check-ins.ts
  git commit -m "security: add server-only boundaries to services and auth helpers"
  ```

---

### Task 4: Fix memory media URL rendering

**Files:**
- Modify: `apps/web/src/components/memory-card.tsx`
- Modify: `apps/web/src/app/memories/[id]/page.tsx`
- Modify: `apps/web/src/components/memory-form.tsx`

- [ ] **Step 1: Replace `<Image>` block in `memory-card.tsx`**

  Remove the `import Image from "next/image"` line and replace the image block:

  ```tsx
  // Remove this import:
  // import Image from "next/image";
  ```

  Replace:
  ```tsx
  {mediaUrl && (
    <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-stone-100">
      <Image
        src={mediaUrl}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        unoptimized
      />
    </div>
  )}
  ```

  With:
  ```tsx
  {mediaUrl && (
    <div className="flex items-center rounded-t-xl border-b border-stone-100 bg-stone-50 px-5 py-3">
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="truncate text-sm text-vixi-teal underline underline-offset-2 hover:text-vixi-dark"
      >
        View media ↗
      </a>
    </div>
  )}
  ```

- [ ] **Step 2: Replace `<Image>` block in the memory detail page**

  In `apps/web/src/app/memories/[id]/page.tsx`, remove `import Image from "next/image"` and replace:

  ```tsx
  {memory.mediaUrl && (
    <div className="relative mt-6 h-64 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
      <Image
        src={memory.mediaUrl}
        alt={memory.title}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
        unoptimized
      />
    </div>
  )}
  ```

  With:

  ```tsx
  {memory.mediaUrl && (
    <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vixi-stone">Media</p>
      <a
        href={memory.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 block truncate text-sm text-vixi-teal underline underline-offset-2 hover:text-vixi-dark"
      >
        {memory.mediaUrl} ↗
      </a>
    </div>
  )}
  ```

- [ ] **Step 3: Add helper text to the media URL field in `memory-form.tsx`**

  Find the `mediaUrl` input field. Below it (after any existing error message), add:

  ```tsx
  <p className="mt-1 text-xs text-vixi-stone">
    Media uploads are not enabled yet. Save an external reference link (e.g. a shared Google Photos URL).
  </p>
  ```

- [ ] **Step 4: Verify build**

  ```bash
  pnpm build
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/memory-card.tsx \
    "apps/web/src/app/memories/[id]/page.tsx" \
    apps/web/src/components/memory-form.tsx
  git commit -m "fix: replace next/image with external link for memory media URLs"
  ```

---

### Task 5: Create `(app)` route group

**Files:**
- Create: `apps/web/src/app/(app)/layout.tsx`
- Move (git mv): all five protected route directories
- Delete: `apps/web/src/app/(app)/dashboard/layout.tsx`

- [ ] **Step 1: Create the `(app)` layout**

  Create `apps/web/src/app/(app)/layout.tsx`:

  ```tsx
  import { ProtectedLayout } from "@/components/protected-layout";

  export default ProtectedLayout;
  ```

- [ ] **Step 2: Move all protected directories into `(app)/`**

  ```bash
  mkdir -p "apps/web/src/app/(app)"
  git mv apps/web/src/app/dashboard "apps/web/src/app/(app)/dashboard"
  git mv apps/web/src/app/vaults "apps/web/src/app/(app)/vaults"
  git mv apps/web/src/app/memories "apps/web/src/app/(app)/memories"
  git mv apps/web/src/app/beneficiaries "apps/web/src/app/(app)/beneficiaries"
  git mv "apps/web/src/app/check-ins" "apps/web/src/app/(app)/check-ins"
  ```

- [ ] **Step 3: Delete the now-redundant `dashboard/layout.tsx`**

  ```bash
  git rm "apps/web/src/app/(app)/dashboard/layout.tsx"
  ```

- [ ] **Step 4: Verify routes still resolve**

  ```bash
  pnpm dev
  ```

  Open http://localhost:3000/dashboard, http://localhost:3000/vaults, http://localhost:3000/memories, http://localhost:3000/beneficiaries, http://localhost:3000/check-ins.

  All should load (redirect to `/login` if not authenticated). The `(app)` prefix does not appear in URLs.

- [ ] **Step 5: Commit**

  ```bash
  git add "apps/web/src/app/(app)"
  git commit -m "refactor: consolidate protected routes into (app) route group"
  ```

---

### Task 6: API helper extraction + route refactor

**Files:**
- Create: `apps/web/src/lib/api.ts`
- Modify: `apps/web/src/app/api/vaults/route.ts`
- Modify: `apps/web/src/app/api/vaults/[id]/route.ts`
- Modify: `apps/web/src/app/api/memories/route.ts`
- Modify: `apps/web/src/app/api/memories/[id]/route.ts`
- Modify: `apps/web/src/app/api/beneficiaries/route.ts`
- Modify: `apps/web/src/app/api/beneficiaries/[id]/route.ts`
- Modify: `apps/web/src/app/api/check-ins/route.ts`
- Modify: `apps/web/src/app/api/check-ins/[id]/route.ts`

- [ ] **Step 1: Create `apps/web/src/lib/api.ts`**

  ```ts
  import "server-only";
  import { NextRequest, NextResponse } from "next/server";
  import type { ZodSchema } from "zod";
  import { getSession } from "@/lib/auth";
  import { NotFoundError, ValidationError } from "@/lib/errors";

  export type ApiSession = {
    user: { id: string; email?: string | null; name?: string | null };
  };

  export async function requireApiSession(): Promise<
    { session: ApiSession } | NextResponse
  > {
    const raw = await getSession();
    if (!raw?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return { session: raw as unknown as ApiSession };
  }

  export async function parseBody<T>(
    req: NextRequest,
    schema: ZodSchema<T>
  ): Promise<{ data: T } | NextResponse> {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    return { data: parsed.data };
  }

  export function handleApiError(err: unknown): NextResponse {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: err.message, issues: err.issues },
        { status: 400 }
      );
    }
    console.error("[api-error]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
  ```

- [ ] **Step 2: Replace `apps/web/src/app/api/vaults/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { createVault, getVaults } from "@/lib/services";
  import { createVaultSchema } from "@/lib/validations";

  export async function GET() {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const vaults = await getVaults(auth.session.user.id);
    return NextResponse.json(vaults);
  }

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const body = await parseBody(req, createVaultSchema);
    if (body instanceof NextResponse) return body;
    try {
      const vault = await createVault(auth.session.user.id, body.data);
      return NextResponse.json(vault, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 3: Replace `apps/web/src/app/api/vaults/[id]/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { deleteVault, getVault, updateVault } from "@/lib/services";
  import { updateVaultSchema } from "@/lib/validations";

  type Params = { params: Promise<{ id: string }> };

  export async function GET(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      const vault = await getVault(auth.session.user.id, id);
      return NextResponse.json(vault);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await parseBody(req, updateVaultSchema);
    if (body instanceof NextResponse) return body;
    try {
      const vault = await updateVault(auth.session.user.id, id, body.data);
      return NextResponse.json(vault);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function DELETE(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      await deleteVault(auth.session.user.id, id);
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 4: Replace `apps/web/src/app/api/memories/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { createMemory, getMemories } from "@/lib/services";
  import { createMemorySchema } from "@/lib/validations";

  export async function GET() {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const memories = await getMemories(auth.session.user.id);
    return NextResponse.json(memories);
  }

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const body = await parseBody(req, createMemorySchema);
    if (body instanceof NextResponse) return body;
    try {
      const memory = await createMemory(auth.session.user.id, body.data);
      return NextResponse.json(memory, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 5: Replace `apps/web/src/app/api/memories/[id]/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { deleteMemory, getMemory, updateMemory } from "@/lib/services";
  import { updateMemorySchema } from "@/lib/validations";

  type Params = { params: Promise<{ id: string }> };

  export async function GET(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      const memory = await getMemory(auth.session.user.id, id);
      return NextResponse.json(memory);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await parseBody(req, updateMemorySchema);
    if (body instanceof NextResponse) return body;
    try {
      const memory = await updateMemory(auth.session.user.id, id, body.data);
      return NextResponse.json(memory);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function DELETE(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      await deleteMemory(auth.session.user.id, id);
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 6: Replace `apps/web/src/app/api/beneficiaries/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { createBeneficiary, getBeneficiaries } from "@/lib/services";
  import { createBeneficiarySchema } from "@/lib/validations";

  export async function GET() {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const beneficiaries = await getBeneficiaries(auth.session.user.id);
    return NextResponse.json(beneficiaries);
  }

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const body = await parseBody(req, createBeneficiarySchema);
    if (body instanceof NextResponse) return body;
    try {
      const beneficiary = await createBeneficiary(auth.session.user.id, body.data);
      return NextResponse.json(beneficiary, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 7: Replace `apps/web/src/app/api/beneficiaries/[id]/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import {
    deleteBeneficiary,
    getBeneficiary,
    updateBeneficiary,
  } from "@/lib/services";
  import { updateBeneficiarySchema } from "@/lib/validations";

  type Params = { params: Promise<{ id: string }> };

  export async function GET(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      const beneficiary = await getBeneficiary(auth.session.user.id, id);
      return NextResponse.json(beneficiary);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await parseBody(req, updateBeneficiarySchema);
    if (body instanceof NextResponse) return body;
    try {
      const beneficiary = await updateBeneficiary(auth.session.user.id, id, body.data);
      return NextResponse.json(beneficiary);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function DELETE(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      await deleteBeneficiary(auth.session.user.id, id);
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 8: Replace `apps/web/src/app/api/check-ins/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { createCheckIn, getCheckIns } from "@/lib/services";
  import { createCheckInSchema } from "@/lib/validations";

  export async function GET() {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const checkIns = await getCheckIns(auth.session.user.id);
    return NextResponse.json(checkIns);
  }

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const body = await parseBody(req, createCheckInSchema);
    if (body instanceof NextResponse) return body;
    try {
      const checkIn = await createCheckIn(auth.session.user.id, body.data);
      return NextResponse.json(checkIn, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 9: Replace `apps/web/src/app/api/check-ins/[id]/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { deleteCheckIn, getCheckIn, updateCheckIn } from "@/lib/services";
  import { updateCheckInSchema } from "@/lib/validations";

  type Params = { params: Promise<{ id: string }> };

  export async function GET(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      const checkIn = await getCheckIn(auth.session.user.id, id);
      return NextResponse.json(checkIn);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await parseBody(req, updateCheckInSchema);
    if (body instanceof NextResponse) return body;
    try {
      const checkIn = await updateCheckIn(auth.session.user.id, id, body.data);
      return NextResponse.json(checkIn);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function DELETE(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      await deleteCheckIn(auth.session.user.id, id);
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 10: Build and verify**

  ```bash
  pnpm build
  ```

  Expected: build succeeds. All API routes still respond identically.

- [ ] **Step 11: Commit**

  ```bash
  git add apps/web/src/lib/api.ts \
    "apps/web/src/app/api/vaults/route.ts" \
    "apps/web/src/app/api/vaults/[id]/route.ts" \
    "apps/web/src/app/api/memories/route.ts" \
    "apps/web/src/app/api/memories/[id]/route.ts" \
    "apps/web/src/app/api/beneficiaries/route.ts" \
    "apps/web/src/app/api/beneficiaries/[id]/route.ts" \
    "apps/web/src/app/api/check-ins/route.ts" \
    "apps/web/src/app/api/check-ins/[id]/route.ts"
  git commit -m "refactor: extract requireApiSession/parseBody/handleApiError, apply to all routes"
  ```

---

### Task 7: LOCAL_DEV.md

**Files:**
- Create: `docs/LOCAL_DEV.md`

- [ ] **Step 1: Create `docs/LOCAL_DEV.md`**

  ```markdown
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
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add docs/LOCAL_DEV.md
  git commit -m "docs: add LOCAL_DEV.md with setup steps and troubleshooting"
  ```

---

## Phase 2 — Trust Infrastructure Schema

### Task 8: AuditLog schema migration + service

**Files:**
- Modify: `packages/db/prisma/schema.prisma`
- Create: `apps/web/src/lib/services/audit.ts`
- Modify: `apps/web/src/lib/services/index.ts`

- [ ] **Step 1: Add AuditLog model and enum to `packages/db/prisma/schema.prisma`**

  Add to the `User` model relations:
  ```prisma
  auditLogs AuditLog[]
  ```

  Add the model and enum at the end of the schema file:

  ```prisma
  model AuditLog {
    id         String      @id @default(cuid())
    userId     String      @map("user_id")
    action     AuditAction
    entityType String      @map("entity_type")
    entityId   String?     @map("entity_id")
    metadata   Json?
    createdAt  DateTime    @default(now()) @map("created_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId, createdAt])
    @@map("audit_logs")
  }

  enum AuditAction {
    CREATE
    UPDATE
    DELETE
    VIEW
  }
  ```

- [ ] **Step 2: Apply migration**

  ```bash
  pnpm db:migrate
  ```

  When prompted for a migration name, enter: `add_audit_log`

  Expected output includes: `✔ Generated Prisma Client` and `The migration was applied`.

- [ ] **Step 3: Create `apps/web/src/lib/services/audit.ts`**

  ```ts
  import "server-only";
  import { prisma } from "@vixi/db";

  export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "VIEW";

  export async function logAuditEvent(
    userId: string,
    action: AuditAction,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, metadata },
    });
  }
  ```

- [ ] **Step 4: Export from `apps/web/src/lib/services/index.ts`**

  Add at the end:

  ```ts
  export * from "./audit";
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add packages/db/prisma/schema.prisma \
    packages/db/prisma/migrations \
    apps/web/src/lib/services/audit.ts \
    apps/web/src/lib/services/index.ts
  git commit -m "feat: add AuditLog model and logAuditEvent service"
  ```

---

### Task 9: Wire audit events into existing services

**Files:**
- Modify: `apps/web/src/lib/services/vaults.ts`
- Modify: `apps/web/src/lib/services/memories.ts`
- Modify: `apps/web/src/lib/services/beneficiaries.ts`
- Modify: `apps/web/src/lib/services/check-ins.ts`

- [ ] **Step 1: Update `vaults.ts`** — add `import { logAuditEvent }` and call it in create/update/delete

  Full updated file:

  ```ts
  import "server-only";
  import { prisma } from "@vixi/db";
  import type { CreateVaultInput, UpdateVaultInput } from "@/lib/validations";
  import { NotFoundError } from "@/lib/errors";
  import { logAuditEvent } from "./audit";

  export async function getVaults(userId: string) {
    return prisma.vault.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { contents: true } } },
    });
  }

  export async function getVault(userId: string, id: string) {
    const vault = await prisma.vault.findFirst({
      where: { id, userId },
      include: { contents: { orderBy: { createdAt: "desc" } } },
    });
    if (!vault) throw new NotFoundError("Vault");
    return vault;
  }

  export async function createVault(userId: string, input: CreateVaultInput) {
    const vault = await prisma.vault.create({ data: { ...input, userId } });
    await logAuditEvent(userId, "CREATE", "Vault", vault.id, { type: vault.type });
    return vault;
  }

  export async function updateVault(
    userId: string,
    id: string,
    input: UpdateVaultInput
  ) {
    const existing = await prisma.vault.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError("Vault");
    const vault = await prisma.vault.update({ where: { id, userId }, data: input });
    await logAuditEvent(userId, "UPDATE", "Vault", id);
    return vault;
  }

  export async function deleteVault(userId: string, id: string) {
    const existing = await prisma.vault.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError("Vault");
    await prisma.vault.delete({ where: { id, userId } });
    await logAuditEvent(userId, "DELETE", "Vault", id);
  }
  ```

- [ ] **Step 2: Update `memories.ts`** — add audit import and wire create/update/delete

  Add `import { logAuditEvent } from "./audit";` and update the three mutating functions to call `logAuditEvent` after a successful Prisma operation. Pattern (apply to createMemory, updateMemory, deleteMemory):

  ```ts
  // createMemory — after prisma.memory.create:
  await logAuditEvent(userId, "CREATE", "Memory", memory.id, { tags: input.tags });

  // updateMemory — after prisma.memory.update:
  await logAuditEvent(userId, "UPDATE", "Memory", id);

  // deleteMemory — after prisma.memory.delete:
  await logAuditEvent(userId, "DELETE", "Memory", id);
  ```

- [ ] **Step 3: Update `beneficiaries.ts`** — same pattern

  ```ts
  // createBeneficiary — after prisma.beneficiary.create:
  await logAuditEvent(userId, "CREATE", "Beneficiary", beneficiary.id);

  // updateBeneficiary — after prisma.beneficiary.update:
  await logAuditEvent(userId, "UPDATE", "Beneficiary", id);

  // deleteBeneficiary — after prisma.beneficiary.delete:
  await logAuditEvent(userId, "DELETE", "Beneficiary", id);
  ```

- [ ] **Step 4: Update `check-ins.ts`** — same pattern

  ```ts
  // createCheckIn — after prisma.checkIn.create:
  await logAuditEvent(userId, "CREATE", "CheckIn", checkIn.id);

  // updateCheckIn — after prisma.checkIn.update:
  await logAuditEvent(userId, "UPDATE", "CheckIn", id);

  // deleteCheckIn — after prisma.checkIn.delete:
  await logAuditEvent(userId, "DELETE", "CheckIn", id);
  ```

- [ ] **Step 5: Build and verify**

  ```bash
  pnpm build
  ```

- [ ] **Step 6: Smoke test**

  Start dev server, log in as `demo@vixi.app / demo1234`, create a vault, then check the DB:

  ```bash
  pnpm db:studio
  ```

  Open the `audit_logs` table — one row should appear for the create.

- [ ] **Step 7: Commit**

  ```bash
  git add apps/web/src/lib/services/vaults.ts \
    apps/web/src/lib/services/memories.ts \
    apps/web/src/lib/services/beneficiaries.ts \
    apps/web/src/lib/services/check-ins.ts
  git commit -m "feat: wire audit events into all CRUD service functions"
  ```

---

### Task 10: UserConsent schema + onboarding gate

**Files:**
- Modify: `packages/db/prisma/schema.prisma`
- Create: `apps/web/src/app/onboarding/consent/page.tsx`
- Create: `apps/web/src/app/api/onboarding/consent/route.ts`
- Modify: `apps/web/src/components/protected-layout.tsx`

- [ ] **Step 1: Add UserConsent model to `packages/db/prisma/schema.prisma`**

  Add to the `User` model relations:
  ```prisma
  consents UserConsent[]
  ```

  Add model and enum at the end of the file:

  ```prisma
  model UserConsent {
    id          String      @id @default(cuid())
    userId      String      @map("user_id")
    consentType ConsentType
    version     String
    acceptedAt  DateTime    @default(now()) @map("accepted_at")
    ipAddress   String?     @map("ip_address")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, consentType, version])
    @@map("user_consents")
  }

  enum ConsentType {
    TERMS_OF_SERVICE
    PRIVACY_POLICY
    NOT_LEGAL_ADVICE_DISCLAIMER
    AI_AVATAR_CONSENT
  }
  ```

- [ ] **Step 2: Apply migration**

  ```bash
  pnpm db:migrate
  ```

  Migration name: `add_user_consent`

- [ ] **Step 3: Create `apps/web/src/app/onboarding/consent/page.tsx`**

  ```tsx
  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { Button } from "@vixi/ui";

  export default function ConsentPage() {
    const [legalAdvice, setLegalAdvice] = useState(false);
    const [terms, setTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      await fetch("/api/onboarding/consent", { method: "POST" });
      router.push("/dashboard");
      router.refresh();
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-vixi-cream p-8">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-vixi-dark">
            Before you continue
          </h1>
          <p className="mt-3 text-sm text-vixi-stone">
            Please read and confirm the following before using Vixi.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={legalAdvice}
                onChange={(e) => setLegalAdvice(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-vixi-teal"
              />
              <span className="text-sm text-vixi-dark">
                I understand that Vixi does <strong>not</strong> provide legal
                advice and does not create a legally binding will or testament.
                I will consult a qualified attorney for legal documents.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-vixi-teal"
              />
              <span className="text-sm text-vixi-dark">
                I accept the Terms of Service and Privacy Policy.
              </span>
            </label>
            <Button
              type="submit"
              disabled={!legalAdvice || !terms || loading}
              className="w-full"
            >
              {loading ? "Saving…" : "Continue to Vixi"}
            </Button>
          </form>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 4: Create `apps/web/src/app/api/onboarding/consent/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession } from "@/lib/api";
  import { prisma } from "@vixi/db";

  const CONSENT_VERSION = "2026-06";

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;

    const ip = req.headers.get("x-forwarded-for") ?? null;

    await prisma.userConsent.createMany({
      data: [
        {
          userId: auth.session.user.id,
          consentType: "NOT_LEGAL_ADVICE_DISCLAIMER",
          version: CONSENT_VERSION,
          ipAddress: ip,
        },
        {
          userId: auth.session.user.id,
          consentType: "TERMS_OF_SERVICE",
          version: CONSENT_VERSION,
          ipAddress: ip,
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ ok: true });
  }
  ```

- [ ] **Step 5: Add consent gate to `apps/web/src/components/protected-layout.tsx`**

  Full updated file:

  ```tsx
  import { redirect } from "next/navigation";
  import { requireAuth } from "@/lib/auth";
  import { prisma } from "@vixi/db";
  import { Sidebar } from "@/components/sidebar";

  const REQUIRED_CONSENT_TYPES = [
    "NOT_LEGAL_ADVICE_DISCLAIMER",
    "TERMS_OF_SERVICE",
  ] as const;

  export async function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const session = await requireAuth();

    const consentCount = await prisma.userConsent.count({
      where: {
        userId: session.user.id,
        consentType: { in: [...REQUIRED_CONSENT_TYPES] },
      },
    });

    if (consentCount < REQUIRED_CONSENT_TYPES.length) {
      redirect("/onboarding/consent");
    }

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-vixi-cream p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    );
  }
  ```

  > **Note:** Existing users (including the seeded `demo@vixi.app` account) will be redirected to `/onboarding/consent` on their next login. This is expected — they need to complete consent once. The seed script does not need updating.

- [ ] **Step 6: Build and verify**

  ```bash
  pnpm build
  ```

- [ ] **Step 7: Smoke test**

  Log in as `demo@vixi.app / demo1234`. You should be redirected to `/onboarding/consent`. Check both checkboxes and submit. You should land on `/dashboard`.

- [ ] **Step 8: Commit**

  ```bash
  git add packages/db/prisma/schema.prisma \
    packages/db/prisma/migrations \
    "apps/web/src/app/onboarding/consent/page.tsx" \
    "apps/web/src/app/api/onboarding/consent/route.ts" \
    apps/web/src/components/protected-layout.tsx
  git commit -m "feat: add UserConsent model, onboarding consent page, and ProtectedLayout gate"
  ```

---

### Task 11: Beneficiary model enrichment

**Files:**
- Modify: `packages/db/prisma/schema.prisma`
- Modify: `apps/web/src/lib/validations/beneficiary.ts`
- Test: `apps/web/src/lib/validations/__tests__/beneficiary.test.ts`
- Modify: `apps/web/src/components/beneficiary-form.tsx`
- Modify: `apps/web/src/components/beneficiary-card.tsx`
- Modify: `apps/web/src/components/sidebar.tsx`

- [ ] **Step 1: Add enums and fields to `packages/db/prisma/schema.prisma`**

  Add three fields to the `Beneficiary` model (they go between `trusted` and `createdAt`):

  ```prisma
  role         BeneficiaryRole @default(BENEFICIARY)
  accessLevel  AccessLevel     @default(NONE)
  inviteStatus InviteStatus    @default(NOT_INVITED)
  ```

  Add three enums at the end of the file:

  ```prisma
  enum BeneficiaryRole {
    EXECUTOR
    BENEFICIARY
    EMERGENCY_CONTACT
    MEMORY_RECIPIENT
    PET_CARETAKER
    FUNERAL_CONTACT
  }

  enum AccessLevel {
    NONE
    SUMMARY
    SPECIFIC_ITEMS
    FULL_AFTER_RELEASE
  }

  enum InviteStatus {
    NOT_INVITED
    INVITED
    ACCEPTED
    DECLINED
  }
  ```

- [ ] **Step 2: Apply migration**

  ```bash
  pnpm db:migrate
  ```

  Migration name: `add_beneficiary_role_access_invite`

  All existing rows get the defaults (`BENEFICIARY`, `NONE`, `NOT_INVITED`). No data loss.

- [ ] **Step 3: Write failing validation tests**

  In `apps/web/src/lib/validations/__tests__/beneficiary.test.ts`, add after the existing tests:

  ```ts
  describe("role / accessLevel / inviteStatus fields", () => {
    it("accepts valid role", () => {
      const result = createBeneficiarySchema.safeParse({
        name: "Alice",
        email: "alice@example.com",
        role: "EXECUTOR",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid role", () => {
      const result = createBeneficiarySchema.safeParse({
        name: "Alice",
        email: "alice@example.com",
        role: "RANDOM_ROLE",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid accessLevel", () => {
      const result = createBeneficiarySchema.safeParse({
        name: "Alice",
        email: "alice@example.com",
        accessLevel: "FULL_AFTER_RELEASE",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid inviteStatus", () => {
      const result = createBeneficiarySchema.safeParse({
        name: "Alice",
        email: "alice@example.com",
        inviteStatus: "INVITED",
      });
      expect(result.success).toBe(true);
    });
  });
  ```

- [ ] **Step 4: Run tests — expect failures**

  ```bash
  cd apps/web && pnpm vitest run src/lib/validations/__tests__/beneficiary.test.ts
  ```

  Expected: new tests FAIL (fields not in schema yet).

- [ ] **Step 5: Update `apps/web/src/lib/validations/beneficiary.ts`**

  ```ts
  import { z } from "zod";

  const beneficiaryRoles = [
    "EXECUTOR",
    "BENEFICIARY",
    "EMERGENCY_CONTACT",
    "MEMORY_RECIPIENT",
    "PET_CARETAKER",
    "FUNERAL_CONTACT",
  ] as const;

  const accessLevels = [
    "NONE",
    "SUMMARY",
    "SPECIFIC_ITEMS",
    "FULL_AFTER_RELEASE",
  ] as const;

  const inviteStatuses = [
    "NOT_INVITED",
    "INVITED",
    "ACCEPTED",
    "DECLINED",
  ] as const;

  const baseBeneficiarySchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(/^[+\d\s()-]+$/, "Invalid phone number")
      .optional(),
    relationship: z.string().max(50).optional(),
    trusted: z.boolean().default(false),
    role: z.enum(beneficiaryRoles).default("BENEFICIARY"),
    accessLevel: z.enum(accessLevels).default("NONE"),
    inviteStatus: z.enum(inviteStatuses).default("NOT_INVITED"),
  });

  export const createBeneficiarySchema = baseBeneficiarySchema.strict();
  export const updateBeneficiarySchema = baseBeneficiarySchema.partial().strict();

  export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>;
  export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>;
  ```

- [ ] **Step 6: Run tests — expect pass**

  ```bash
  cd apps/web && pnpm vitest run src/lib/validations/__tests__/beneficiary.test.ts
  ```

  Expected: all tests PASS.

- [ ] **Step 7: Update `beneficiary-form.tsx`** — add role, accessLevel, and inviteStatus selects

  Inside the form, after the `trusted` checkbox and before the submit button, add:

  ```tsx
  <div>
    <label className="block text-sm font-medium text-vixi-dark">Role</label>
    <select
      {...register("role")}
      className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
    >
      <option value="BENEFICIARY">Beneficiary</option>
      <option value="EXECUTOR">Executor</option>
      <option value="EMERGENCY_CONTACT">Emergency Contact</option>
      <option value="MEMORY_RECIPIENT">Memory Recipient</option>
      <option value="PET_CARETAKER">Pet Caretaker</option>
      <option value="FUNERAL_CONTACT">Funeral Contact</option>
    </select>
  </div>
  <div>
    <label className="block text-sm font-medium text-vixi-dark">Access Level</label>
    <select
      {...register("accessLevel")}
      className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
    >
      <option value="NONE">None</option>
      <option value="SUMMARY">Summary</option>
      <option value="SPECIFIC_ITEMS">Specific Items</option>
      <option value="FULL_AFTER_RELEASE">Full After Release</option>
    </select>
    <p className="mt-1 text-xs text-vixi-stone">
      Notifications and access grants are not automatic — these settings take effect when release rules are configured.
    </p>
  </div>
  ```

  Also update the form's `defaultValues` initialization to include:

  ```ts
  role: "BENEFICIARY",
  accessLevel: "NONE",
  inviteStatus: "NOT_INVITED",
  ```

- [ ] **Step 8: Update `beneficiary-card.tsx`** — show role badge

  Add a role label below the existing trusted/standard badge. Replace the existing badge logic with:

  ```tsx
  const ROLE_LABELS: Record<string, string> = {
    EXECUTOR: "Executor",
    BENEFICIARY: "Beneficiary",
    EMERGENCY_CONTACT: "Emergency",
    MEMORY_RECIPIENT: "Memory Recipient",
    PET_CARETAKER: "Pet Caretaker",
    FUNERAL_CONTACT: "Funeral Contact",
  };
  ```

  Update the `BeneficiaryCardProps` type to add:
  ```ts
  role: string;
  ```

  Below the name/relationship block in the card, add:
  ```tsx
  <span className="mt-1 inline-block rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-vixi-stone">
    {ROLE_LABELS[role] ?? role}
  </span>
  ```

- [ ] **Step 9: Update `sidebar.tsx`** — rename nav entry

  Find the `navItems` array entry for `/beneficiaries` and change the label from `"Beneficiaries"` to `"Trusted Contacts"`.

- [ ] **Step 10: Update the beneficiaries list page heading**

  In `apps/web/src/app/(app)/beneficiaries/page.tsx`, change the `<h1>` text from `"Beneficiaries"` to `"Trusted Contacts"`.

- [ ] **Step 11: Build and test**

  ```bash
  pnpm build && cd apps/web && pnpm test
  ```

  Expected: build succeeds, all tests pass.

- [ ] **Step 12: Commit**

  ```bash
  git add packages/db/prisma/schema.prisma \
    packages/db/prisma/migrations \
    apps/web/src/lib/validations/beneficiary.ts \
    "apps/web/src/lib/validations/__tests__/beneficiary.test.ts" \
    apps/web/src/components/beneficiary-form.tsx \
    apps/web/src/components/beneficiary-card.tsx \
    apps/web/src/components/sidebar.tsx \
    "apps/web/src/app/(app)/beneficiaries/page.tsx"
  git commit -m "feat: add role/accessLevel/inviteStatus to Beneficiary, rename to Trusted Contacts"
  ```

---

### Task 12: FinalWish domain

**Files:**
- Modify: `packages/db/prisma/schema.prisma`
- Create: `apps/web/src/lib/services/wishes.ts`
- Create: `apps/web/src/lib/validations/wish.ts`
- Create: `apps/web/src/lib/validations/__tests__/wish.test.ts`
- Modify: `apps/web/src/lib/services/index.ts`
- Modify: `apps/web/src/lib/validations/index.ts`
- Create: `apps/web/src/app/api/wishes/route.ts`
- Create: `apps/web/src/app/api/wishes/[id]/route.ts`
- Create: `apps/web/src/app/(app)/wishes/page.tsx`
- Create: `apps/web/src/app/(app)/wishes/new/page.tsx`
- Create: `apps/web/src/app/(app)/wishes/[id]/page.tsx`
- Create: `apps/web/src/app/(app)/wishes/[id]/edit/page.tsx`
- Create: `apps/web/src/components/wish-card.tsx`
- Create: `apps/web/src/components/wish-form.tsx`
- Create: `apps/web/src/components/delete-wish-button.tsx`
- Modify: `apps/web/src/components/sidebar.tsx`

- [ ] **Step 1: Add FinalWish model and enum to `packages/db/prisma/schema.prisma`**

  Add to the `User` model relations:
  ```prisma
  finalWishes FinalWish[]
  ```

  Add model and enum at the end of the file:

  ```prisma
  model FinalWish {
    id         String       @id @default(cuid())
    userId     String       @map("user_id")
    category   WishCategory
    title      String
    body       String       @db.Text
    archivedAt DateTime?    @map("archived_at")
    createdAt  DateTime     @default(now()) @map("created_at")
    updatedAt  DateTime     @updatedAt @map("updated_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@map("final_wishes")
  }

  enum WishCategory {
    FUNERAL_PREFERENCE
    BURIAL_CREMATION
    PEOPLE_TO_NOTIFY
    PET_CARE
    DIGITAL_ACCOUNTS
    LEGAL_NOTES
    OTHER
  }
  ```

- [ ] **Step 2: Apply migration**

  ```bash
  pnpm db:migrate
  ```

  Migration name: `add_final_wish`

- [ ] **Step 3: Write failing wish validation tests**

  Create `apps/web/src/lib/validations/__tests__/wish.test.ts`:

  ```ts
  import { describe, it, expect } from "vitest";
  import { createWishSchema, updateWishSchema } from "../wish";

  describe("createWishSchema", () => {
    it("accepts valid wish", () => {
      const result = createWishSchema.safeParse({
        category: "FUNERAL_PREFERENCE",
        title: "My funeral wishes",
        body: "Please keep it simple.",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing title", () => {
      const result = createWishSchema.safeParse({
        category: "OTHER",
        body: "Something",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = createWishSchema.safeParse({
        category: "FLYING",
        title: "Test",
        body: "Test",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty body", () => {
      const result = createWishSchema.safeParse({
        category: "OTHER",
        title: "Test",
        body: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateWishSchema", () => {
    it("accepts partial update", () => {
      const result = updateWishSchema.safeParse({ title: "New title" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category in partial update", () => {
      const result = updateWishSchema.safeParse({ category: "NOPE" });
      expect(result.success).toBe(false);
    });
  });
  ```

- [ ] **Step 4: Run tests — expect failures**

  ```bash
  cd apps/web && pnpm vitest run src/lib/validations/__tests__/wish.test.ts
  ```

  Expected: all FAIL (module not found).

- [ ] **Step 5: Create `apps/web/src/lib/validations/wish.ts`**

  ```ts
  import { z } from "zod";

  const wishCategories = [
    "FUNERAL_PREFERENCE",
    "BURIAL_CREMATION",
    "PEOPLE_TO_NOTIFY",
    "PET_CARE",
    "DIGITAL_ACCOUNTS",
    "LEGAL_NOTES",
    "OTHER",
  ] as const;

  export const createWishSchema = z.object({
    category: z.enum(wishCategories),
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(10000),
  });

  export const updateWishSchema = createWishSchema.partial();

  export type CreateWishInput = z.infer<typeof createWishSchema>;
  export type UpdateWishInput = z.infer<typeof updateWishSchema>;
  ```

- [ ] **Step 6: Run tests — expect pass**

  ```bash
  cd apps/web && pnpm vitest run src/lib/validations/__tests__/wish.test.ts
  ```

  Expected: all PASS.

- [ ] **Step 7: Export from `apps/web/src/lib/validations/index.ts`**

  Add:
  ```ts
  export * from "./wish";
  ```

- [ ] **Step 8: Create `apps/web/src/lib/services/wishes.ts`**

  ```ts
  import "server-only";
  import { prisma } from "@vixi/db";
  import type { CreateWishInput, UpdateWishInput } from "@/lib/validations";
  import { NotFoundError } from "@/lib/errors";
  import { logAuditEvent } from "./audit";

  export async function getWishes(userId: string) {
    return prisma.finalWish.findMany({
      where: { userId, archivedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  export async function getWish(userId: string, id: string) {
    const wish = await prisma.finalWish.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!wish) throw new NotFoundError("Wish");
    return wish;
  }

  export async function createWish(userId: string, input: CreateWishInput) {
    const wish = await prisma.finalWish.create({ data: { ...input, userId } });
    await logAuditEvent(userId, "CREATE", "FinalWish", wish.id, { category: wish.category });
    return wish;
  }

  export async function updateWish(
    userId: string,
    id: string,
    input: UpdateWishInput
  ) {
    const existing = await prisma.finalWish.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!existing) throw new NotFoundError("Wish");
    const wish = await prisma.finalWish.update({ where: { id }, data: input });
    await logAuditEvent(userId, "UPDATE", "FinalWish", id);
    return wish;
  }

  export async function archiveWish(userId: string, id: string) {
    const existing = await prisma.finalWish.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!existing) throw new NotFoundError("Wish");
    await prisma.finalWish.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
    await logAuditEvent(userId, "DELETE", "FinalWish", id);
  }
  ```

- [ ] **Step 9: Export from `apps/web/src/lib/services/index.ts`**

  Add:
  ```ts
  export * from "./wishes";
  ```

- [ ] **Step 10: Create `apps/web/src/app/api/wishes/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { createWish, getWishes } from "@/lib/services";
  import { createWishSchema } from "@/lib/validations";

  export async function GET() {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const wishes = await getWishes(auth.session.user.id);
    return NextResponse.json(wishes);
  }

  export async function POST(req: NextRequest) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const body = await parseBody(req, createWishSchema);
    if (body instanceof NextResponse) return body;
    try {
      const wish = await createWish(auth.session.user.id, body.data);
      return NextResponse.json(wish, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 11: Create `apps/web/src/app/api/wishes/[id]/route.ts`**

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
  import { archiveWish, getWish, updateWish } from "@/lib/services";
  import { updateWishSchema } from "@/lib/validations";

  type Params = { params: Promise<{ id: string }> };

  export async function GET(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      const wish = await getWish(auth.session.user.id, id);
      return NextResponse.json(wish);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function PATCH(req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await parseBody(req, updateWishSchema);
    if (body instanceof NextResponse) return body;
    try {
      const wish = await updateWish(auth.session.user.id, id, body.data);
      return NextResponse.json(wish);
    } catch (err) {
      return handleApiError(err);
    }
  }

  export async function DELETE(_req: NextRequest, { params }: Params) {
    const auth = await requireApiSession();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    try {
      await archiveWish(auth.session.user.id, id);
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return handleApiError(err);
    }
  }
  ```

- [ ] **Step 12: Create `apps/web/src/components/wish-card.tsx`**

  ```tsx
  import Link from "next/link";

  const CATEGORY_LABELS: Record<string, string> = {
    FUNERAL_PREFERENCE: "Funeral Preference",
    BURIAL_CREMATION: "Burial / Cremation",
    PEOPLE_TO_NOTIFY: "People to Notify",
    PET_CARE: "Pet Care",
    DIGITAL_ACCOUNTS: "Digital Accounts",
    LEGAL_NOTES: "Legal Notes",
    OTHER: "Other",
  };

  type WishCardProps = {
    id: string;
    category: string;
    title: string;
    body: string;
  };

  export function WishCard({ id, category, title, body }: WishCardProps) {
    return (
      <Link
        href={`/wishes/${id}`}
        className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
      >
        <span className="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone">
          {CATEGORY_LABELS[category] ?? category}
        </span>
        <h3 className="mt-2 line-clamp-1 font-heading text-lg font-bold text-vixi-dark">
          {title}
        </h3>
        <p className="mt-1 line-clamp-3 text-sm text-vixi-stone">{body}</p>
      </Link>
    );
  }
  ```

- [ ] **Step 13: Create `apps/web/src/components/wish-form.tsx`**

  ```tsx
  "use client";

  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useRouter } from "next/navigation";
  import { Button } from "@vixi/ui";
  import { createWishSchema, type CreateWishInput } from "@/lib/validations";

  const CATEGORY_OPTIONS = [
    { value: "FUNERAL_PREFERENCE", label: "Funeral Preference" },
    { value: "BURIAL_CREMATION", label: "Burial / Cremation" },
    { value: "PEOPLE_TO_NOTIFY", label: "People to Notify" },
    { value: "PET_CARE", label: "Pet Care" },
    { value: "DIGITAL_ACCOUNTS", label: "Digital Accounts" },
    { value: "LEGAL_NOTES", label: "Legal Notes" },
    { value: "OTHER", label: "Other" },
  ] as const;

  type WishFormProps = {
    defaultValues?: Partial<CreateWishInput>;
    wishId?: string;
  };

  export function WishForm({ defaultValues, wishId }: WishFormProps) {
    const router = useRouter();
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateWishInput>({
      resolver: zodResolver(createWishSchema),
      defaultValues,
    });

    async function onSubmit(data: CreateWishInput) {
      const url = wishId ? `/api/wishes/${wishId}` : "/api/wishes";
      const method = wishId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const wish = await res.json();
        router.push(`/wishes/${wish.id}`);
        router.refresh();
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-vixi-dark">
            Category
          </label>
          <select
            {...register("category")}
            className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-vixi-dark">
            Title
          </label>
          <input
            {...register("title")}
            className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
            placeholder="e.g. Burial instructions"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-vixi-dark">
            Details
          </label>
          <textarea
            {...register("body")}
            rows={6}
            className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
            placeholder="Describe your wishes in detail…"
          />
          {errors.body && (
            <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : wishId ? "Save Changes" : "Add Wish"}
        </Button>
      </form>
    );
  }
  ```

- [ ] **Step 14: Create `apps/web/src/components/delete-wish-button.tsx`**

  ```tsx
  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { Button } from "@vixi/ui";

  type DeleteWishButtonProps = {
    wishId: string;
    wishTitle: string;
  };

  export function DeleteWishButton({ wishId, wishTitle }: DeleteWishButtonProps) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleArchive() {
      setArchiving(true);
      setError(null);
      const res = await fetch(`/api/wishes/${wishId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to archive");
        setArchiving(false);
        return;
      }
      router.push("/wishes");
      router.refresh();
    }

    if (!confirming) {
      return (
        <Button variant="destructive" onClick={() => setConfirming(true)}>
          Archive wish
        </Button>
      );
    }

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Archive{" "}
          <span className="font-semibold">{wishTitle}</span>? It will no longer
          appear in your wishes list.
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-3 flex gap-2">
          <Button
            variant="destructive"
            onClick={handleArchive}
            disabled={archiving}
          >
            {archiving ? "Archiving…" : "Yes, archive"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirming(false)}
            disabled={archiving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 15: Create `apps/web/src/app/(app)/wishes/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { Suspense } from "react";
  import { Button, EmptyState } from "@vixi/ui";
  import { requireAuth } from "@/lib/auth";
  import { getWishes } from "@/lib/services";
  import { WishCard } from "@/components/wish-card";

  async function WishesContent() {
    const session = await requireAuth();
    const wishes = await getWishes(session.user.id);

    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-vixi-dark">
            Final Wishes
          </h1>
          <Button asChild>
            <Link href="/wishes/new">Add Wish</Link>
          </Button>
        </div>
        {wishes.length === 0 ? (
          <EmptyState
            title="No wishes recorded"
            description="Record your final wishes, funeral preferences, and important instructions for your loved ones."
            action={{ label: "Add your first wish", href: "/wishes/new" }}
          />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish) => (
              <WishCard key={wish.id} {...wish} />
            ))}
          </div>
        )}
      </div>
    );
  }

  export default function WishesPage() {
    return (
      <Suspense fallback={<div className="animate-pulse text-vixi-stone">Loading…</div>}>
        <WishesContent />
      </Suspense>
    );
  }
  ```

- [ ] **Step 16: Create `apps/web/src/app/(app)/wishes/new/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { WishForm } from "@/components/wish-form";

  export default function NewWishPage() {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-vixi-stone">
          <Link href="/wishes" className="hover:underline">
            Final Wishes
          </Link>
          <span>/</span>
          <span>New</span>
        </div>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-vixi-dark">
          Add a Wish
        </h1>
        <div className="mt-6">
          <WishForm />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 17: Create `apps/web/src/app/(app)/wishes/[id]/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { notFound } from "next/navigation";
  import { Button, Card } from "@vixi/ui";
  import { requireAuth } from "@/lib/auth";
  import { getWish } from "@/lib/services";
  import { NotFoundError } from "@/lib/errors";
  import { DeleteWishButton } from "@/components/delete-wish-button";

  const CATEGORY_LABELS: Record<string, string> = {
    FUNERAL_PREFERENCE: "Funeral Preference",
    BURIAL_CREMATION: "Burial / Cremation",
    PEOPLE_TO_NOTIFY: "People to Notify",
    PET_CARE: "Pet Care",
    DIGITAL_ACCOUNTS: "Digital Accounts",
    LEGAL_NOTES: "Legal Notes",
    OTHER: "Other",
  };

  type Params = { params: Promise<{ id: string }> };

  export default async function WishDetailPage({ params }: Params) {
    const session = await requireAuth();
    const { id } = await params;

    let wish;
    try {
      wish = await getWish(session.user.id, id);
    } catch (err) {
      if (err instanceof NotFoundError) notFound();
      throw err;
    }

    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-vixi-stone">
          <Link href="/wishes" className="hover:underline">
            Final Wishes
          </Link>
          <span>/</span>
          <span>{wish.title}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-vixi-dark">
            {wish.title}
          </h1>
          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone">
            {CATEGORY_LABELS[wish.category] ?? wish.category}
          </span>
        </div>
        <Card className="mt-6 p-6">
          <p className="whitespace-pre-wrap text-vixi-dark">{wish.body}</p>
        </Card>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href={`/wishes/${wish.id}/edit`}>Edit wish</Link>
          </Button>
          <DeleteWishButton wishId={wish.id} wishTitle={wish.title} />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 18: Create `apps/web/src/app/(app)/wishes/[id]/edit/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { notFound } from "next/navigation";
  import { requireAuth } from "@/lib/auth";
  import { getWish } from "@/lib/services";
  import { NotFoundError } from "@/lib/errors";
  import { WishForm } from "@/components/wish-form";

  type Params = { params: Promise<{ id: string }> };

  export default async function EditWishPage({ params }: Params) {
    const session = await requireAuth();
    const { id } = await params;

    let wish;
    try {
      wish = await getWish(session.user.id, id);
    } catch (err) {
      if (err instanceof NotFoundError) notFound();
      throw err;
    }

    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-vixi-stone">
          <Link href="/wishes" className="hover:underline">
            Final Wishes
          </Link>
          <span>/</span>
          <Link href={`/wishes/${id}`} className="hover:underline">
            {wish.title}
          </Link>
          <span>/</span>
          <span>Edit</span>
        </div>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-vixi-dark">
          Edit Wish
        </h1>
        <div className="mt-6">
          <WishForm
            wishId={wish.id}
            defaultValues={{
              category: wish.category,
              title: wish.title,
              body: wish.body,
            }}
          />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 19: Add "Wishes" to `sidebar.tsx`**

  Import `ScrollText` from lucide-react (add to existing import line), then add to the `navItems` array:

  ```ts
  { href: "/wishes", label: "Wishes", icon: ScrollText },
  ```

  Place it after the Check-ins entry.

- [ ] **Step 20: Build and run all tests**

  ```bash
  pnpm build && cd apps/web && pnpm test
  ```

  Expected: build succeeds, all tests pass.

- [ ] **Step 21: Smoke test**

  ```bash
  pnpm dev
  ```

  Log in, navigate to `/wishes`, create a wish, edit it, archive it. Confirm it disappears from the list. Check `audit_logs` in Prisma Studio for CREATE and DELETE entries.

- [ ] **Step 22: Commit**

  ```bash
  git add packages/db/prisma/schema.prisma \
    packages/db/prisma/migrations \
    apps/web/src/lib/services/wishes.ts \
    apps/web/src/lib/services/index.ts \
    apps/web/src/lib/validations/wish.ts \
    apps/web/src/lib/validations/index.ts \
    "apps/web/src/lib/validations/__tests__/wish.test.ts" \
    "apps/web/src/app/api/wishes/route.ts" \
    "apps/web/src/app/api/wishes/[id]/route.ts" \
    "apps/web/src/app/(app)/wishes/page.tsx" \
    "apps/web/src/app/(app)/wishes/new/page.tsx" \
    "apps/web/src/app/(app)/wishes/[id]/page.tsx" \
    "apps/web/src/app/(app)/wishes/[id]/edit/page.tsx" \
    apps/web/src/components/wish-card.tsx \
    apps/web/src/components/wish-form.tsx \
    apps/web/src/components/delete-wish-button.tsx \
    apps/web/src/components/sidebar.tsx
  git commit -m "feat: add FinalWish domain — CRUD with archive-on-delete, audit logging, Wishes nav entry"
  ```
