import Link from "next/link";
import { Button } from "@vixi/ui";

export default function NewMemoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Add a memory
      </h1>
      <p className="mt-2 text-vixi-stone">
        Preserve a story, moment, or piece of wisdom for future generations.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <p className="text-vixi-stone">
          Memory creation form coming in Ticket 005.
        </p>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/memories">← Back to memories</Link>
        </Button>
      </div>
    </div>
  );
}
