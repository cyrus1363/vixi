import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getVault } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { VaultForm } from "@/components/vault-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditVaultPage({ params }: Params) {
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
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link
          href="/vaults"
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          Vaults
        </Link>
        <span>/</span>
        <Link
          href={`/vaults/${vault.id}`}
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          {vault.name}
        </Link>
        <span>/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
        Edit vault
      </h1>
      <p className="mt-2 text-vixi-stone">
        Update the details for this vault.
      </p>

      <Card className="mt-8 p-8">
        <VaultForm
          mode="edit"
          vaultId={vault.id}
          defaultValues={{
            name: vault.name,
            description: vault.description ?? "",
            type: vault.type,
            status: vault.status,
            unlockDate: vault.unlockDate
              ? (vault.unlockDate.toISOString().slice(0, 16) as unknown as Date)
              : undefined,
          }}
        />
      </Card>
    </div>
  );
}
