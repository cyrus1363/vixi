# Design Spec — Hardening & Trust Infrastructure

**Date:** 2026-06-09
**Status:** Approved

## Context

Codex reviewed the Vixi repository and surfaced two categories of work:

1. **Foundation hardening** — code correctness issues, auth risks, missing safety guardrails
2. **Trust infrastructure** — schema and product additions that the platform's actual purpose (death planning, legacy, beneficiary notification) requires before further feature work is safe to build on

This spec covers both in two sequential phases. Phase 3 (ReleaseRule automation, AI avatar) is explicitly out of scope.

---

## Phase 1 — Foundation Hardening

### 1.1 Root scripts

**Problem:** Root `package.json` has no `db:*` scripts. A fresh clone following the README must `cd packages/db` to run database commands.

**Fix:** Add the following to root `package.json` scripts:

```json
"db:generate": "pnpm --filter @vixi/db db:generate",
"db:push":     "pnpm --filter @vixi/db db:push",
"db:migrate":  "pnpm --filter @vixi/db db:migrate",
"db:studio":   "pnpm --filter @vixi/db db:studio",
"db:seed":     "pnpm --filter @vixi/db db:seed",
"typecheck":   "turbo typecheck"
```

Also add a `typecheck` task to `turbo.json` that runs `tsc --noEmit` in each package.

### 1.2 Auth hardening

**Problem:** `packages/auth/src/config.ts` contains `allowDangerousEmailAccountLinking: true` on the Google provider. This permits an attacker who controls an email address to link to an existing credentials account without verifying ownership.

**Fix:** Remove the flag entirely. The Google provider block becomes:

```ts
Google({ clientId: googleClientId, clientSecret: googleClientSecret })
```

No other auth changes. Credentials login and conditional Google OAuth are already correct.

### 1.3 `server-only` boundaries

**Problem:** Service files (`vaults.ts`, `memories.ts`, `beneficiaries.ts`, `check-ins.ts`) and `apps/web/src/lib/auth.ts` import Prisma and bcrypt. If accidentally imported into a client component, the build silently bundles server secrets into the client.

**Fix:** Add `import "server-only";` as the first line of each of the five files above. Next.js will throw a build error if any reach a client bundle.

### 1.4 Memory media URL rendering

**Problem:** `memory-card.tsx` renders `mediaUrl` via `<Image unoptimized src={mediaUrl}>`. The `unoptimized` flag bypasses Next.js domain restrictions so it won't crash, but it loads arbitrary external images in-page — a privacy leak (external servers see the user's IP) and misleading UX (implies the image is stored when it's just a link).

**Fix:** Replace the `<Image>` block with a plain anchor tag:

```tsx
{mediaUrl && (
  <a
    href={mediaUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 inline-flex items-center gap-1 text-sm text-vixi-teal underline"
    onClick={(e) => e.stopPropagation()}
  >
    View media ↗
  </a>
)}
```

Apply the same treatment to the memory detail page. Add helper text to the memory form beneath the media URL field: "Media uploads are not enabled yet. You can save an external reference link."

### 1.5 Route group consolidation

**Problem:** `dashboard/layout.tsx` uses `ProtectedLayout` but all other sections (`vaults/`, `memories/`, `beneficiaries/`, `check-ins/`) call `requireAuth()` individually in each page file. A new route added without a `requireAuth()` call would be publicly accessible.

**Fix:** Create an `(app)` route group. Move all protected sections inside it. Add a single `(app)/layout.tsx` that renders `<ProtectedLayout>`. Per-page `requireAuth()` calls are no longer needed for *protection* — the layout guarantees auth. However, pages that need a typed `session.user.id` for data queries (most of them) still call `requireAuth()` at the top to obtain it; this is a session lookup, not re-running auth logic. The protection story is: "if the layout rendered, auth passed" — the per-page call is just a typed accessor.

Directory result:
```
src/app/
  (app)/
    layout.tsx          ← single ProtectedLayout call
    dashboard/
    vaults/
    memories/
    beneficiaries/
    check-ins/
  login/
  register/
  layout.tsx            ← root layout (fonts, metadata)
```

### 1.6 API helper consolidation

**Problem:** Every API route handler repeats the same three-part boilerplate: check session, validate body with Zod, catch `NotFoundError`/`ValidationError`. This is ~30 lines per route across 8+ route files.

**Fix:** Add `apps/web/src/lib/api.ts` (marked `server-only`) with:

```ts
// Returns session or returns a 401 NextResponse (caller should return it)
export async function requireApiSession(
): Promise<{ session: Session } | NextResponse>

// Parses req.json() and validates against schema.
// Returns { data } or returns a 400 NextResponse.
export async function parseBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | NextResponse>

// Maps known error types to appropriate NextResponse.
export function handleApiError(err: unknown): NextResponse
```

Refactor all existing route handlers to use these. API behavior and response shapes stay identical.

---

## Phase 2 — Trust Infrastructure Schema

### 2.1 AuditLog

**New model:**

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  action     AuditAction
  entityType String   @map("entity_type")
  entityId   String?  @map("entity_id")
  metadata   Json?
  createdAt  DateTime @default(now()) @map("created_at")

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

**Service helper:** `apps/web/src/lib/services/audit.ts` exports `logAuditEvent(userId, action, entityType, entityId?, metadata?)`. Marked `server-only`.

**Wiring:** Call `logAuditEvent` inside `createVault`, `updateVault`, `deleteVault` (and equivalent for Memory, Beneficiary, CheckIn). Never store body content or passwords in `metadata` — only structural identifiers (e.g. `{ type: "WILL" }`).

### 2.2 UserConsent

**New model:**

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

**Flow:**
1. After registration, redirect to `/onboarding/consent`.
2. Page shows two non-skippable checkboxes: "I understand Vixi does not provide legal advice" and "I understand Vixi does not create a legally binding will."
3. Submission writes two `UserConsent` records (`NOT_LEGAL_ADVICE_DISCLAIMER` + `TERMS_OF_SERVICE`) at version `"2026-06"`.
4. `ProtectedLayout` checks for the presence of these consent records. If absent, redirect to `/onboarding/consent`. This makes the gate impossible to bypass.

### 2.3 Beneficiary model enrichment

**Additive migration** (no data loss — all new fields have defaults):

```prisma
model Beneficiary {
  // existing fields unchanged ...
  role         BeneficiaryRole    @default(BENEFICIARY)
  accessLevel  AccessLevel        @default(NONE)
  inviteStatus InviteStatus       @default(NOT_INVITED)
}

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

**UI changes:**
- Rename "Beneficiaries" → "Trusted Contacts" in sidebar nav and page headings (DB model name stays `Beneficiary`).
- Add role, access level, and invite status fields to the create/edit form.
- Add helper text on the form: "Notifications and access grants are not automatic — these settings take effect when release rules are configured."

**Validation:** Update `beneficiary.ts` Zod schema to include the three new fields (optional on create, with defaults).

### 2.4 FinalWish table

**New model:**

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

**Routes:** `/wishes` (list), `/wishes/new`, `/wishes/[id]`, `/wishes/[id]/edit`. Standard CRUD, same pattern as existing domains.

**Delete behavior:** "Delete" archives (`archivedAt = now()`) rather than hard-deletes. List page shows only non-archived. Archived items are not shown anywhere in the UI for now (no archive view needed yet).

**Sidebar:** Add "Wishes" entry between "Check-ins" and the bottom of the nav.

---

## Soft Delete (applies across domains)

Phase 1 introduces the `archivedAt` pattern on `FinalWish`. In a follow-on task (not this spec), the same pattern can be retrofitted to `Vault` and `Memory` — the two entities most likely to hold emotionally irreplaceable content. `Beneficiary` and `CheckIn` are lower risk for hard deletes.

---

## Out of Scope

- `ReleaseRule` model and any automated release or notification behavior
- File upload for media
- AI avatar functionality
- Encryption of body/content fields
- Rate limiting on auth endpoints
- Admin tooling

---

## Acceptance Criteria

**Phase 1:**
- `pnpm db:push` and `pnpm db:seed` work from repo root
- `pnpm typecheck` runs and passes from repo root
- `allowDangerousEmailAccountLinking` is gone from auth config
- All service files and `auth.ts` have `import "server-only"` as first line
- Memory cards do not render external images inline
- All protected routes are inside `(app)/` group; no per-page redundant `requireAuth()` calls
- API routes use shared helpers; no duplicated session/validation/error boilerplate

**Phase 2:**
- `AuditLog` table exists; create/update/delete on all four domains writes a log entry
- New user registration flow routes through `/onboarding/consent`; `ProtectedLayout` enforces consent gate
- Beneficiary form has role, access level, invite status fields; sidebar says "Trusted Contacts"
- `/wishes` CRUD works; delete archives rather than hard-deletes
