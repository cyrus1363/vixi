import Link from "next/link";
import { Suspense } from "react";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@vixi/db";
import { DashboardSkeleton } from "./skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await requireAuth();

  const [vaultCount, beneficiaryCount, memoryCount] = await Promise.all([
    prisma.vault.count({ where: { userId: session.user.id } }),
    prisma.beneficiary.count({ where: { userId: session.user.id } }),
    prisma.memory.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Welcome back, {session.user.name || session.user.email}
      </h1>
      <p className="mt-2 text-vixi-stone">
        Here&apos;s an overview of your legacy plan.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="text-sm font-medium text-vixi-stone">Vaults</div>
          <div className="mt-2 text-3xl font-bold text-vixi-gold">
            {vaultCount}
          </div>
          <p className="mt-1 text-xs text-vixi-stone">
            Secure containers for your important documents and messages.
          </p>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-vixi-stone">
            Beneficiaries
          </div>
          <div className="mt-2 text-3xl font-bold text-vixi-gold">
            {beneficiaryCount}
          </div>
          <p className="mt-1 text-xs text-vixi-stone">
            People you&apos;ve designated to receive your legacy.
          </p>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-vixi-stone">Memories</div>
          <div className="mt-2 text-3xl font-bold text-vixi-gold">
            {memoryCount}
          </div>
          <p className="mt-1 text-xs text-vixi-stone">
            Cherished moments preserved for future generations.
          </p>
        </Card>
      </div>

      <Card className="mt-10 p-6">
        <h2 className="font-heading text-lg font-bold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/vaults/new">+ Create new vault</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/memories/new">+ Add a memory</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/beneficiaries/new">+ Add beneficiary</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/check-ins/new">+ Schedule check-in</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
