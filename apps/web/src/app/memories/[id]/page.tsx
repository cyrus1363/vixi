import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getMemory } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteMemoryButton } from "@/components/delete-memory-button";
import { MemoryDetailSkeleton } from "./skeleton";

type Params = { params: Promise<{ id: string }> };

export default function MemoryDetailPage({ params }: Params) {
  return (
    <Suspense fallback={<MemoryDetailSkeleton />}>
      <MemoryDetailContent params={params} />
    </Suspense>
  );
}

async function MemoryDetailContent({ params }: Params) {
  const session = await requireAuth();
  const { id } = await params;

  let memory;
  try {
    memory = await getMemory(session.user.id, id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link
          href="/memories"
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          Memories
        </Link>
        <span>/</span>
        <span>{memory.title}</span>
      </div>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
        {memory.title}
      </h1>

      {memory.mediaUrl && (
        <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-vixi-stone">Media</p>
          <a
            href={memory.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm text-vixi-teal underline underline-offset-2 hover:text-vixi-dark"
          >
            {memory.mediaUrl} ↗
          </a>
        </div>
      )}

      <Card className="mt-6 p-6">
        <p className="whitespace-pre-wrap text-vixi-dark">{memory.body}</p>
      </Card>

      {memory.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {memory.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={`/memories/${memory.id}/edit`}>Edit memory</Link>
        </Button>
        <DeleteMemoryButton
          memoryId={memory.id}
          memoryTitle={memory.title}
        />
      </div>
    </div>
  );
}
