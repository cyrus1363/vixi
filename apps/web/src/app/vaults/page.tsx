import Link from "next/link";
import { Suspense } from "react";
import { Button, EmptyState } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getVaults } from "@/lib/services";
import { VaultCard } from "@/components/vault-card";
import { VaultListSkeleton } from "./skeleton";

export default function VaultsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Your Vaults</h1>
          <p className="mt-2 text-vixi-stone">
            Secure containers for your important documents and messages.
          </p>
        </div>
        <Button asChild>
          <Link href="/vaults/new">+ New vault</Link>
        </Button>
      </div>

      <Suspense fallback={<VaultListSkeleton />}>
        <VaultsContent />
      </Suspense>
    </div>
  );
}

async function VaultsContent() {
  const session = await requireAuth();
  const vaults = await getVaults(session.user.id);

  if (vaults.length === 0) {
    return (
      <EmptyState
        title="No vaults yet"
        description="Create your first vault to start storing important documents, messages, and legacy information securely."
        action={
          <Button asChild>
            <Link href="/vaults/new">Create your first vault</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vaults.map((vault) => (
        <VaultCard
          key={vault.id}
          id={vault.id}
          name={vault.name}
          description={vault.description}
          type={vault.type}
          status={vault.status}
          contentCount={vault._count.contents}
        />
      ))}
    </div>
  );
}
