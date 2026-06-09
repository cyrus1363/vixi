# Ticket 004 — Vaults CRUD

## Goal

Implement full CRUD for Vaults: list, create, read, update, delete — both via pages and API routes.

## Scope

### Pages
- `/vaults` — server-rendered list from `getVaults(userId)`, shows cards with name/type/status/content count, link to detail, "Create vault" CTA
- `/vaults/new` — client form using react-hook-form + Zod resolver, calls `POST /api/vaults`
- `/vaults/[id]` — server-rendered detail from `getVault(userId, id)`, shows vault info + contents list, "Edit" and "Delete" actions
- `/vaults/[id]/edit` — client form, calls `PATCH /api/vaults/[id]`

### API Routes
- `POST /api/vaults` — create
- `GET /api/vaults/[id]` — read single
- `PATCH /api/vaults/[id]` — update
- `DELETE /api/vaults/[id]` — delete

### Authorization
- All endpoints call `requireAuth()` to get `userId`
- Service layer enforces user scope (already done in Ticket 003)
- API responses: 401 (no auth), 404 (not found or cross-user), 400 (validation), 200/201 (success)

### UI Components Needed
- `vault-card.tsx` — list item display
- `vault-form.tsx` — shared form for create/edit
- `delete-vault-button.tsx` — confirmation dialog with form action

## Data Model

No schema changes — uses existing `Vault` model + `createVaultSchema`/`updateVaultSchema` from Ticket 003.

## Tests

Tests already cover the service layer. Page-level tests deferred to a future ticket (no existing e2e setup).

## Files

### New
- `apps/web/src/app/vaults/[id]/page.tsx`
- `apps/web/src/app/vaults/[id]/edit/page.tsx`
- `apps/web/src/app/vaults/[id]/not-found.tsx`
- `apps/web/src/components/vault-card.tsx`
- `apps/web/src/components/vault-form.tsx`
- `apps/web/src/components/delete-vault-button.tsx`
- `apps/web/src/app/api/vaults/route.ts`
- `apps/web/src/app/api/vaults/[id]/route.ts`

### Modified
- `apps/web/src/app/vaults/page.tsx` — real data
- `apps/web/src/app/vaults/new/page.tsx` — real form

## Acceptance Criteria

- [x] User can see their vaults on /vaults
- [x] User can create a vault via /vaults/new
- [x] User can view a vault's details on /vaults/[id]
- [x] User can edit a vault on /vaults/[id]/edit
- [x] User can delete a vault (with confirmation)
- [x] Cross-user access returns 404
- [x] Validation errors display inline on form
- [x] Build passes with 0 errors
- [x] Lint passes with 0 errors
