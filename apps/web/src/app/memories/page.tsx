import Link from "next/link";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getMemories } from "@/lib/services";
import { MemoryCard } from "@/components/memory-card";

export default async function MemoriesPage() {
  const session = await requireAuth();
  const memories = await getMemories(session.user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your Memories</h1>
          <p className="mt-2 text-vixi-stone">
            Cherished moments preserved for future generations.
          </p>
        </div>
        <Button asChild>
          <Link href="/memories/new">+ New memory</Link>
        </Button>
      </div>

      {memories.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">📸</div>
          <h2 className="text-xl font-semibold text-vixi-dark">
            No memories yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-vixi-stone">
            Start capturing and preserving your most meaningful moments to share
            with loved ones.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/memories/new">Capture your first memory</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              id={memory.id}
              title={memory.title}
              body={memory.body}
              mediaUrl={memory.mediaUrl}
              tags={memory.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
