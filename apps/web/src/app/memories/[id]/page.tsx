import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getMemory } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteMemoryButton } from "@/components/delete-memory-button";

type Params = { params: Promise<{ id: string }> };

export default async function MemoryDetailPage({ params }: Params) {
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
        <Link href="/memories" className="hover:underline">
          Memories
        </Link>
        <span>/</span>
        <span>{memory.title}</span>
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {memory.title}
      </h1>

      {memory.mediaUrl && (
        <div className="relative mt-6 h-64 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
          <Image
            src={memory.mediaUrl}
            alt={memory.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
        <p className="whitespace-pre-wrap text-vixi-dark">{memory.body}</p>
      </div>

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
