import Link from "next/link";
import { Button } from "@vixi/ui";
import { MemoryForm } from "@/components/memory-form";

export default function NewMemoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Capture a new memory
      </h1>
      <p className="mt-2 text-vixi-stone">
        Record a moment, story, or reflection to preserve for the future.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <MemoryForm mode="create" />
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/memories">← Back to memories</Link>
        </Button>
      </div>
    </div>
  );
}
