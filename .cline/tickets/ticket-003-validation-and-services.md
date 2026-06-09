# Ticket 003 — Shared Validation and User-Scoped Service Layer

## Goal

Establish the foundational validation and data access layer that all feature tickets (004–010) will build on. This ticket creates:

1. **Zod validation schemas** for all four core domain models (Vault, Memory, Beneficiary, CheckIn)
2. **User-scoped service functions** that enforce authorization at the data access boundary
3. **Unit tests** for the validation schemas

## Why

Currently, the only validated input is the registration form (Zod schema inline in `register/route.ts`). All other Prisma queries happen directly in page components (e.g., `dashboard/page.tsx`), with no centralization. This creates three risks:

- **Authorization gaps** — every page that touches the DB must remember to filter by `userId`. One missed `where: { userId }` leaks another user's data.
- **Validation drift** — input validation will be copy-pasted into forms and API routes, drifting over time.
- **No reuse** — duplicate Prisma query patterns in every page.

## In Scope

| File | Action | Purpose |
|------|--------|---------|
| `apps/web/src/lib/validations/vault.ts` | Create | Zod schema for vault create/update |
| `apps/web/src/lib/validations/memory.ts` | Create | Zod schema for memory create/update |
| `apps/web/src/lib/validations/beneficiary.ts` | Create | Zod schema for beneficiary create/update |
| `apps/web/src/lib/validations/check-in.ts` | Create | Zod schema for check-in create/update |
| `apps/web/src/lib/validations/index.ts` | Create | Re-export all schemas |
| `apps/web/src/lib/services/vaults.ts` | Create | getVaults, getVault, createVault, updateVault, deleteVault |
| `apps/web/src/lib/services/memories.ts` | Create | getMemories, getMemory, createMemory, updateMemory, deleteMemory |
| `apps/web/src/lib/services/beneficiaries.ts` | Create | getBeneficiaries, getBeneficiary, createBeneficiary, updateBeneficiary, deleteBeneficiary |
| `apps/web/src/lib/services/check-ins.ts` | Create | getCheckIns, getCheckIn, createCheckIn, updateCheckIn, deleteCheckIn |
| `apps/web/src/lib/services/index.ts` | Create | Re-export all services |
| `apps/web/vitest.config.ts` | Create | Vitest config for apps/web |
| `apps/web/src/lib/validations/__tests__/vault.test.ts` | Create | Validation tests |
| `apps/web/src/lib/validations/__tests__/memory.test.ts` | Create | Validation tests |
| `apps/web/src/lib/validations/__tests__/beneficiary.test.ts` | Create | Validation tests |
| `apps/web/src/lib/validations/__tests__/check-in.test.ts` | Create | Validation tests |

## Out of Scope

- No new UI pages (Tickets 004–008 handle those)
- No new Prisma models or migrations
- No changes to existing auth, dashboard, or sidebar components
- No API route handlers yet (those come in feature tickets)

## Acceptance Criteria

1. All four validation schemas exist and are exported from `validations/index.ts`
2. All four service modules exist, each with at minimum: list, get-by-id, create, update, delete
3. Every service function takes a `userId` parameter (or uses `requireAuth()` internally) and **always** scopes Prisma queries by `userId`
4. Every `get*` and `delete*` function that operates on a single record throws `NotFoundError` when the record doesn't exist or belongs to a different user
5. Vitest is installed and configured for `apps/web`
6. At least 4 test cases per validation schema (valid input, missing field, invalid email, out-of-range number)
7. `pnpm build` passes with 0 errors
8. `pnpm lint` passes with 0 warnings
9. `pnpm test` runs and all tests pass

## Implementation Details

### Validation Schemas

Each schema should:
- Use `z.object({...})` and export both the schema and the inferred TypeScript type
- Use `.strict()` or `.strip()` consistently (recommend `.strict()` to reject unknown fields — prevents mass assignment)
- Validate enums via `z.nativeEnum(VaultType)` etc. (imported from `@prisma/client`)
- Have a separate "create" and "update" schema (update uses `.partial()`)
- For optional fields with defaults, use `.optional()` or `.default()`

Example structure:
```typescript
import { z } from "zod";
import { VaultType, VaultStatus } from "@prisma/client";

export const createVaultSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(VaultType).default("GENERAL"),
  status: z.nativeEnum(VaultStatus).default("ACTIVE"),
  unlockDate: z.coerce.date().optional(),
}).strict();

export const updateVaultSchema = createVaultSchema.partial();

export type CreateVaultInput = z.infer<typeof createVaultSchema>;
export type UpdateVaultInput = z.infer<typeof updateVaultSchema>;
```

### Service Layer

Each service function:
- Accepts `userId: string` as first arg (or gets it from `requireAuth()` for server components)
- Always includes `userId` in `where` clauses
- For single-record operations, uses `findFirst({ where: { id, userId } })` (not `findUnique`) so it returns null instead of throwing
- Throws a custom `NotFoundError` when a record is not found or doesn't belong to the user
- Returns typed Prisma model objects (or `null` for lists when empty)

Example structure:
```typescript
import { prisma } from "@vixi/db";
import { CreateVaultInput, UpdateVaultInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";

export async function getVaults(userId: string) {
  return prisma.vault.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVault(userId: string, id: string) {
  const vault = await prisma.vault.findFirst({ where: { id, userId } });
  if (!vault) throw new NotFoundError("Vault");
  return vault;
}

export async function createVault(userId: string, input: CreateVaultInput) {
  return prisma.vault.create({
    data: { ...input, userId },
  });
}

// ... updateVault, deleteVault similar
```

### Errors

Create `apps/web/src/lib/errors.ts` with at minimum:
- `NotFoundError` (extends Error, has `entityName: string`)
- `ValidationError` (extends Error, has `issues: z.ZodIssue[]`) — for service functions that need to re-validate

### Testing

Use Vitest (lightweight, Vite-powered, works with Next.js). Add to `apps/web`:
- `vitest` (devDep)
- `vitest.config.ts` with `test: { environment: "node" }` and path alias for `@/*`

Test file pattern:
```typescript
import { describe, it, expect } from "vitest";
import { createVaultSchema } from "../vault";

describe("createVaultSchema", () => {
  it("accepts a valid vault", () => {
    const result = createVaultSchema.safeParse({ name: "My Vault" });
    expect(result.success).toBe(true);
  });
  
  it("rejects missing name", () => {
    const result = createVaultSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  
  it("rejects unknown fields (strict mode)", () => {
    const result = createVaultSchema.safeParse({ name: "X", hackerField: "evil" });
    expect(result.success).toBe(false);
  });
  
  it("rejects name over 100 chars", () => {
    const result = createVaultSchema.safeParse({ name: "x".repeat(101) });
    expect(result.success).toBe(false);
  });
});
```

## Verification Steps

1. Run `cd /var/home/cyrustogo/Desktop/Vixi/apps/web && npx vitest run` — all tests pass
2. Run `npx dotenv -e ../../.env -- next build` — 0 errors
3. Run `npx dotenv -e ../../.env -- next lint` — 0 warnings
4. Spot-check: read one service function and confirm `userId` is in every `where` clause

## Dependencies Added

- `vitest@^2.1.0` to `apps/web` devDependencies
- New scripts: `test`, `test:watch` in `apps/web/package.json`

## Commit

`feat: add Zod validation schemas and user-scoped service layer`
