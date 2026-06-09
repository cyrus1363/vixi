import Link from "next/link";
import { Button } from "@vixi/ui";

export default function MemoriesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Memory Archive
      </h1>
      <p className="mt-2 text-vixi-stone">
        Cherished moments preserved for future generations.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
        <div className="mb-4 text-4xl">📸</div>
        <h2 className="text-xl font-semibold text-vixi-dark">No memories yet</h2>
        <p className="mt-2 max-w-sm text-sm text-vixi-stone">
          Capture your first memory to preserve stories, wisdom, and moments
          for your loved ones.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/memories/new">Add your first memory</Link>
        </Button>
      </div>
    </div>
  );
}
