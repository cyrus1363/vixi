import Link from "next/link";
import { Button, Card } from "@vixi/ui";
import { MemoryForm } from "@/components/memory-form";

export default function NewMemoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Capture a new memory
      </h1>
      <p className="mt-2 text-vixi-stone">
        Record a moment, story, or reflection to preserve for the future.
      </p>

      <Card className="mt-8 p-8">
        <MemoryForm mode="create" />
      </Card>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/memories">← Back to memories</Link>
        </Button>
      </div>
    </div>
  );
}
