# Vixi — Updated Implementation Plan

## Code Review Summary (4 Issues Found)

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | Sidebar active state uses `===` (breaks on `/vaults/abc123`) | **Bug** | `apps/web/src/components/sidebar.tsx:29` |
| 2 | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` exposes client ID to browser bundle | **Medium** | `packages/auth/src/config.ts`, `.env.example` |
| 3 | Docker compose `version: "3.8"` is deprecated in Compose v2 | **Low** | `docker-compose.yml` |
| 4 | Sidebar uses emoji icons (should be lucide-react) | **Low** | `apps/web/src/components/sidebar.tsx` |

**Not Done:** Beneficiaries and Check-ins CRUD (only services + validations exist).

---

## Phase A — Fixes (4 items)

### A1. Sidebar active state (`sidebar.tsx:29`)
- Change `pathname === item.href` → `pathname === item.href || pathname.startsWith(item.href + "/")`
- Preserves exact match for `/dashboard` and avoids `/dashboards-new` false positives

### A2. Google OAuth naming convention
- Rename `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → `GOOGLE_CLIENT_ID` in `packages/auth/src/config.ts`
- Update `.env.example` and `.env` to use `GOOGLE_CLIENT_ID`
- For UI: pass a server-derived `googleEnabled` flag to client components (or use `next.config.js` to inject), instead of reading `NEXT_PUBLIC_*` in client components

### A3. Docker compose
- Remove `version: "3.8"` from `docker-compose.yml`

### A4. Lucide-react icons
- Install `lucide-react` (or check if already available)
- Replace emoji icons in `sidebar.tsx`: 🏠 → `Home`, 🔒 → `Lock`, 📸 → `Camera`, 👥 → `Users`, ⏰ → `Clock`, 🚪 → `LogOut`

---

## Phase B — Beneficiaries CRUD (10 files)

Services + validations already exist (Ticket 003). Follow Vaults pattern:

**API Routes:**
- `apps/web/src/app/api/beneficiaries/route.ts` — GET (list) + POST (create)
- `apps/web/src/app/api/beneficiaries/[id]/route.ts` — GET + PATCH + DELETE

**Pages:**
- `apps/web/src/app/beneficiaries/page.tsx` — list (server component)
- `apps/web/src/app/beneficiaries/new/page.tsx` — create form
- `apps/web/src/app/beneficiaries/[id]/page.tsx` — detail
- `apps/web/src/app/beneficiaries/[id]/edit/page.tsx` — edit form
- `apps/web/src/app/beneficiaries/[id]/not-found.tsx` — custom 404

**Components:**
- `apps/web/src/components/beneficiary-card.tsx` — list card
- `apps/web/src/components/beneficiary-form.tsx` — shared RHF form
- `apps/web/src/components/delete-beneficiary-button.tsx` — confirm UI

**Schema notes:** `trusted` boolean toggle, `phone` optional with regex, `relationship` string.

---

## Phase C — Check-ins CRUD (10 files)

Same pattern as Beneficiaries. Differences:
- `scheduledAt` is a date — use HTML `<input type="datetime-local">` with `z.coerce.date()`
- `status` is an enum select (PENDING / RESPONDED / MISSED / ESCALATED)
- `completedAt` optional date
- `responseToken` not exposed in UI (auto-generated)

**API Routes:** same as beneficiaries structure
**Pages:** list, new, detail, edit, not-found
**Components:** card, form, delete-button

---

## Phase D — Polish (4 items)

### D1. Root `not-found.tsx`
- Already exists at `apps/web/src/app/not-found.tsx` — verify and update if needed
- Add a 404 page for the dashboard area (or rely on global one)

### D2. AUTH_TRUST_HOST
- Add `AUTH_TRUST_HOST=true` to `.env` (was in .env.example but not in active .env)
- Required for non-localhost deployments

### D3. Link verification
- All sidebar links: `/dashboard`, `/vaults`, `/memories`, `/beneficiaries`, `/check-ins`
- All dashboard quick-action links: `/vaults/new`, `/memories/new`, `/beneficiaries/new`
- Add `/check-ins/new` to dashboard quick-actions (consistency with other 3)

### D4. README
- Update README with:
  - Project description
  - Setup instructions (Prerequisites, Install, Database, Run, Test)
  - Available scripts
  - Project structure
  - Tech stack

---

## Execution Order

```
Phase A (4 fixes) → Build+lint verify → Commit
Phase B (Beneficiaries) → Build+lint verify → Commit
Phase C (Check-ins) → Build+lint verify → Commit
Phase D (Polish) → Final verify → Commit
```

Each phase ends with a build + lint verification and a separate commit.

---

## Acceptance Criteria

- All 5 sidebar nav items resolve
- All 4 dashboard quick-action links resolve
- 47+ tests still pass
- Build passes (current: 22 routes, should grow to ~28 with Benef+CheckIns CRUD)
- Lint passes
- No Google client ID in client bundle
- No new ESLint warnings
- README is current and accurate
