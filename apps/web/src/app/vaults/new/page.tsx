import Link from "next/link";
import { Button, Card } from "@vixi/ui";
import { VaultForm } from "@/components/vault-form";

export default function NewVaultPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Create a new vault
      </h1>
      <p className="mt-2 text-vixi-stone">
        Set up a secure container for your legacy documents and messages.
      </p>

      <Card className="mt-8 p-8">
        <VaultForm mode="create" />
      </Card>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/vaults">← Back to vaults</Link>
        </Button>
      </div>
    </div>
  );
}
