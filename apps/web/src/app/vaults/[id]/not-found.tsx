import Link from "next/link";
import { Button } from "@vixi/ui";

export default function VaultNotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-vixi-dark">
        Vault not found
      </h1>
      <p className="mt-4 text-vixi-stone">
        This vault doesn&apos;t exist or has been deleted.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/vaults">Back to vaults</Link>
        </Button>
      </div>
    </div>
  );
}
