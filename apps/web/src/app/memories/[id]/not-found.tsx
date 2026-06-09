import Link from "next/link";
import { Button } from "@vixi/ui";

export default function MemoryNotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-vixi-dark">
        Memory not found
      </h1>
      <p className="mt-4 text-vixi-stone">
        This memory doesn&apos;t exist or has been deleted.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/memories">Back to memories</Link>
        </Button>
      </div>
    </div>
  );
}
