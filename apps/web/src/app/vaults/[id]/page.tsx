import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getVault } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteVaultButton } from "@/components/delete-vault-button";
import { VaultDetailSkeleton } from "./skeleton";

type Params = { params: Promise<{ id: string }> };

const VAULT_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General",
  WILL: "Will",
  INSURANCE: "Insurance",
  FINANCIAL: "Financial",
  DIGITAL_ASSETS: "Digital Assets",
  MESSAGES: "Messages",
};

export default function VaultDetailPage({ params }: Params) {
  return (
    <Suspense fallback={<VaultDetailSkeleton />}>
      <VaultDetailContent params={params} />
    </Suspense>
  );
}

async function VaultDetailContent({ params }: Params) {
  const session = await requireAuth();
  const { id } = await params;

  let vault;
  try {
    vault = await getVault(session.user.id, id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-vixi-stone">
            <Link
              href="/vaults"
              className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
            >
              Vaults
            </Link>
            <span>/</span>
            <span>{vault.name}</span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            {vault.name}
          </h1>
          {vault.description && (
            <p className="mt-2 text-vixi-stone">{vault.description}</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs font-medium uppercase text-vixi-stone">
            Type
          </div>
          <div className="mt-1 text-sm font-medium">
            {VAULT_TYPE_LABELS[vault.type] ?? vault.type}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-medium uppercase text-vixi-stone">
            Status
          </div>
          <div className="mt-1 text-sm font-medium">{vault.status}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-medium uppercase text-vixi-stone">
            Items
          </div>
          <div className="mt-1 text-sm font-medium">
            {vault.contents.length}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={`/vaults/${vault.id}/edit`}>Edit vault</Link>
        </Button>
        <DeleteVaultButton vaultId={vault.id} vaultName={vault.name} />
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg font-bold">Contents</h2>
        {vault.contents.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-vixi-stone">
            No contents yet. Vault content management comes in a future ticket.
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
            {vault.contents.map((content) => (
              <li key={content.id} className="p-4">
                <div className="font-medium">{content.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-vixi-stone">
                  {content.body}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
