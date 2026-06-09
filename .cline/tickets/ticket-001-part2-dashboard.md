# Ticket 001 (Part 2): Dashboard Shell & Remaining Setup

This is a continuation of Ticket 001. After completing Part 1 (monorepo, packages, auth, login), implement the dashboard shell and remaining configuration.

## Step 7: Create the dashboard layout with sidebar

1. Create `apps/web/src/app/(dashboard)/layout.tsx`:
```typescript
import { auth } from "@vixi/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
```

2. Create `apps/web/src/app/(dashboard)/_components/sidebar.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@vixi/ui";
import {
  LayoutDashboard,
  Shield,
  Users,
  ScrollText,
  BookHeart,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vault", label: "Life Vault", icon: Shield },
  { href: "/circle", label: "Trusted Circle", icon: Users },
  { href: "/wishes", label: "Will & Wishes", icon: ScrollText },
  { href: "/memories", label: "Memory Archive", icon: BookHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
          <span className="font-serif font-bold text-xl text-primary">Vixi</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {user.name?.[0] || user.email?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
```

3. Create `apps/web/src/app/(dashboard)/dashboard/page.tsx`:
```typescript
import { auth } from "@vixi/auth";
import { prisma } from "@vixi/db";
import { DashboardCard } from "./_components/dashboard-card";
import { PeaceOfMindRing } from "./_components/peace-of-mind-ring";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [vaultCount, contactCount, memoryCount, funeralPlan] = await Promise.all([
    prisma.vaultItem.count({ where: { userId, deletedAt: null } }),
    prisma.trustedContact.count({ where: { userId, deletedAt: null } }),
    prisma.memory.count({ where: { userId, deletedAt: null } }),
    prisma.funeralPlan.findUnique({ where: { userId } }),
  ]);

  const wishesProgress = funeralPlan?.completionPercentage ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your peace of mind overview.
        </p>
      </div>

      {/* Peace of Mind Ring */}
      <PeaceOfMindRing
        vaultCount={vaultCount}
        contactCount={contactCount}
        memoryCount={memoryCount}
        wishesProgress={wishesProgress}
      />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Life Vault"
          description={vaultCount === 0 ? "No items yet" : `${vaultCount} items stored`}
          href="/vault"
          icon="shield"
          isEmpty={vaultCount === 0}
          emptyMessage="Start by adding accounts, policies, or anything important."
          cta="Add item"
        />
        <DashboardCard
          title="Trusted Circle"
          description={contactCount === 0 ? "No contacts yet" : `${contactCount} contacts`}
          href="/circle"
          icon="users"
          isEmpty={contactCount === 0}
          emptyMessage="Add the people you want to notify or give access to."
          cta="Add contact"
        />
        <DashboardCard
          title="Will & Wishes"
          description={wishesProgress === 0 ? "Not started" : `${wishesProgress}% complete`}
          href="/wishes"
          icon="scroll-text"
          isEmpty={wishesProgress === 0}
          emptyMessage="Start planning your wishes. Even a few notes can bring peace of mind."
          cta="Start planning"
        />
        <DashboardCard
          title="Memory Archive"
          description={memoryCount === 0 ? "No memories yet" : `${memoryCount} memories preserved`}
          href="/memories"
          icon="book-heart"
          isEmpty={memoryCount === 0}
          emptyMessage="Start preserving your stories, photos, and voice notes."
          cta="Add memory"
        />
      </div>
    </div>
  );
}
```

4. Create `apps/web/src/app/(dashboard)/dashboard/_components/dashboard-card.tsx`:
```typescript
"use client";

import Link from "next/link";
import { Shield, Users, ScrollText, BookHeart, Plus } from "lucide-react";
import { cn } from "@vixi/ui";

const iconMap = {
  shield: Shield,
  users: Users,
  "scroll-text": ScrollText,
  "book-heart": BookHeart,
};

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof iconMap;
  isEmpty?: boolean;
  emptyMessage?: string;
  cta?: string;
}

export function DashboardCard({
  title,
  description,
  href,
  icon,
  isEmpty,
  emptyMessage,
  cta,
}: DashboardCardProps) {
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={cn(
        "block p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all",
        isEmpty && "border-dashed"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {isEmpty && cta && (
          <span className="flex items-center gap-1 text-xs text-primary font-medium">
            <Plus className="w-3 h-3" />
            {cta}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className={cn("text-sm mt-1", isEmpty ? "text-muted-foreground" : "text-foreground/70")}>
        {isEmpty && emptyMessage ? emptyMessage : description}
      </p>
    </Link>
  );
}
```

5. Create `apps/web/src/app/(dashboard)/dashboard/_components/peace-of-mind-ring.tsx`:
```typescript
"use client";

interface PeaceOfMindRingProps {
  vaultCount: number;
  contactCount: number;
  memoryCount: number;
  wishesProgress: number;
}

export function PeaceOfMindRing({
  vaultCount,
  contactCount,
  memoryCount,
  wishesProgress,
}: PeaceOfMindRingProps) {
  // Simple progress: vault (1+ items = 25%), contacts (1+ = 25%), wishes (>0% = 25%), memories (1+ = 25%)
  const vaultDone = vaultCount > 0 ? 25 : 0;
  const contactsDone = contactCount > 0 ? 25 : 0;
  const wishesDone = wishesProgress > 0 ? 25 : 0;
  const memoriesDone = memoryCount > 0 ? 25 : 0;
  const total = vaultDone + contactsDone + wishesDone + memoriesDone;

  return (
    <div className="flex items-center gap-6 p-6 rounded-xl bg-card border border-border">
      {/* Ring */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#F0EDE8"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#0D7377"
            strokeWidth="8"
            strokeDasharray={`${total * 2.64} 264`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{total}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Life Vault</span>
          <span className="font-medium">{vaultDone > 0 ? "✓" : "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Trusted Circle</span>
          <span className="font-medium">{contactsDone > 0 ? "✓" : "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-muted-foreground">Will & Wishes</span>
          <span className="font-medium">{wishesDone > 0 ? "✓" : "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Memory Archive</span>
          <span className="font-medium">{memoriesDone > 0 ? "✓" : "—"}</span>
        </div>
      </div>
    </div>
  );
}
```

6. Create placeholder pages for each section (empty states):

`apps/web/src/app/(dashboard)/vault/page.tsx`:
```typescript
import { VaultContent } from "./_components/vault-content";

export default function VaultPage() {
  return <VaultContent />;
}
```

`apps/web/src/app/(dashboard)/vault/_components/vault-content.tsx`:
```typescript
"use client";

import { Shield } from "lucide-react";
import { Button } from "@vixi/ui";

export function VaultContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Shield className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
        Your Life Vault is empty
      </h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Start by adding accounts, policies, assets, or anything important
        you want to organize and share with your trusted circle.
      </p>
      <Button>Add your first item</Button>
    </div>
  );
}
```

Create similar empty-state pages for:
- `apps/web/src/app/(dashboard)/circle/page.tsx` (Users icon, "No trusted contacts yet")
- `apps/web/src/app/(dashboard)/wishes/page.tsx` (ScrollText icon, "Start planning your wishes")
- `apps/web/src/app/(dashboard)/memories/page.tsx` (BookHeart icon, "No memories yet")
- `apps/web/src/app/(dashboard)/settings/page.tsx` (Settings icon, basic settings form placeholder)

## Step 8: Create the Auth API route

Create `apps/web/src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@vixi/auth";

export const { GET, POST } = handlers;
```

## Step 9: Create the register page

Create `apps/web/src/app/(auth)/register/page.tsx`:
```typescript
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Vixi</h1>
          <p className="text-muted-foreground mt-2">
            Begin your legacy journey.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
```

Create `apps/web/src/app/(auth)/register/register-form.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vixi/ui";
import { hash } from "bcryptjs";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const hashedPassword = await hash(password, 12);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: hashedPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
```

Create `apps/web/src/app/api/auth/register/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@vixi/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        emailVerified: new Date(), // Auto-verify for MVP
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Step 10: Install dependencies and verify

1. Run `pnpm install` from root
2. Run `docker compose up -d` to start PostgreSQL
3. Copy `.env.example` to `.env` and generate an AUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```
4. Run `pnpm --filter @vixi/db db:push` to create tables
5. Run `pnpm --filter @vixi/db db:seed` to seed vault categories
6. Run `pnpm dev` to start the dev server
7. Visit `http://localhost:3000` — should redirect to `/login`
8. Register a new account
9. Should redirect to `/dashboard` with empty states

## Data/Schema Changes

- Full Prisma schema as defined above (all MVP tables)
- Seed data for `vault_categories`

## UI States

- **Loading:** Skeleton/spinner on dashboard while data loads
- **Empty:** Dashboard shows empty-state cards with CTAs; each section shows its own empty state
- **Error:** Error banner on login/register forms
- **Success:** Redirect to dashboard after login/register
- **Edge cases:** Already logged in → redirect to dashboard; expired session → redirect to login

## Edge Cases

- User visits `/dashboard` without session → redirect to `/login`
- User visits `/login` with active session → redirect to `/dashboard`
- Registration with existing email → 409 error shown in form
- Weak password → browser-side `minLength={8}` validation
- Database connection failure → 500 error on register, login fails gracefully

## Tests / Verification

1. `pnpm install` completes without errors
2. `docker compose up -d` starts PostgreSQL
3. `pnpm --filter @vixi/db db:push` creates all tables
4. `pnpm --filter @vixi/db db:seed` populates vault categories
5. `pnpm dev` starts without errors
6. Visit `/` → redirects to `/login`
7. Register → creates user, redirects to `/dashboard`
8. Dashboard shows empty states for all sections
9. Sidebar navigation works for all links
10. Sign out → redirects to `/login`
11. Sign in with registered credentials → redirects to `/dashboard`

## Acceptance Criteria

- [ ] Monorepo structure is set up with Turborepo and pnpm workspaces
- [ ] PostgreSQL runs via Docker Compose
- [ ] Prisma schema includes all MVP tables (User, Account, Session, VaultCategory, VaultItem, VaultItemFile, TrustedContact, FuneralPlan, GuardianshipNote, DigitalAssetInstruction, FinalMessage, Memory, MemoryFile, AuditLog)
- [ ] Auth.js v5 is configured with credentials provider
- [ ] Login page renders at `/login`
- [ ] Register page renders at `/register`
- [ ] Registration API creates user and returns success
- [ ] Dashboard layout has sidebar with Vixi branding and navigation
- [ ] Dashboard shows Peace of Mind ring and empty-state cards
- [ ] All section placeholder pages show appropriate empty states
- [ ] Auth middleware protects dashboard routes
- [ ] `pnpm dev` runs without TypeScript or build errors

## Do Not Touch

- Do not modify the Prisma schema after initial creation without a new ticket
- Do not add AI avatar code or release rules yet
- Do not add payment/subscription logic
- Do not modify the color palette without a design ticket
