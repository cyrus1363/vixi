import Link from "next/link";
import { Suspense } from "react";
import { Camera } from "lucide-react";
import { Button, EmptyState } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getMemories } from "@/lib/services";
import { MemoryCard } from "@/components/memory-card";
import { MemoryListSkeleton } from "./skeleton";

export default function MemoriesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Your Memories</h1>
          <p className="mt-2 text-vixi-stone">
            Cherished moments preserved for future generations.
          </p>
        </div>
        <Button asChild>
          <Link href="/memories/new">+ New memory</Link>
        </Button>
      </div>

      <Suspense fallback={<MemoryListSkeleton />}>
        <MemoriesContent />
      </Suspense>
    </div>
  );
}

async function MemoriesContent() {
  const session = await requireAuth();
  const memories = await getMemories(session.user.id);

  if (memories.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="No memories yet"
        description="Start capturing and preserving your most meaningful moments to share with loved ones."
        action={
          <Button asChild>
            <Link href="/memories/new">Capture your first memory</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
