import Link from "next/link";
import { Button } from "@vixi/ui";
import { VaultForm } from "@/components/vault-form";

export default function NewVaultPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Create a new vault
      </h1>
      <p className="mt-2 text-vixi-stone">
        Set up a secure container for your legacy documents and messages.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <VaultForm mode="create" />
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/vaults">← Back to vaults</Link>
        </Button>
      </div>
    </div>
  );
}
