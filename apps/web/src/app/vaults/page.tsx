import Link from "next/link";
import { Button } from "@vixi/ui";

export default function VaultsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Your Vaults</h1>
      <p className="mt-2 text-vixi-stone">
        Secure containers for your important documents and messages.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
        <div className="mb-4 text-4xl">🔒</div>
        <h2 className="text-xl font-semibold text-vixi-dark">No vaults yet</h2>
        <p className="mt-2 max-w-sm text-sm text-vixi-stone">
          Create your first vault to start storing important documents,
          messages, and legacy information securely.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/vaults/new">Create your first vault</Link>
        </Button>
      </div>
    </div>
  );
}
