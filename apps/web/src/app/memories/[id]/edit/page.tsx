import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getMemory } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { MemoryForm } from "@/components/memory-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditMemoryPage({ params }: Params) {
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
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/memories" className="hover:underline">
          Memories
        </Link>
        <span>/</span>
        <Link href={`/memories/${memory.id}`} className="hover:underline">
          {memory.title}
        </Link>
        <span>/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Edit memory
      </h1>
      <p className="mt-2 text-vixi-stone">
        Update the details for this memory.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <MemoryForm
          mode="edit"
          memoryId={memory.id}
          defaultValues={{
            title: memory.title,
            body: memory.body,
            mediaUrl: memory.mediaUrl ?? "",
            tags: memory.tags,
          }}
        />
      </div>
    </div>
  );
}
