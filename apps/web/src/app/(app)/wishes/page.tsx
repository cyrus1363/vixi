import Link from "next/link";
import { Suspense } from "react";
import { Button, EmptyState } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getWishes } from "@/lib/services";
import { WishCard } from "@/components/wish-card";

async function WishesContent() {
  const session = await requireAuth();
  const wishes = await getWishes(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-vixi-dark">
          Final Wishes
        </h1>
        <Button asChild>
          <Link href="/wishes/new">Add Wish</Link>
        </Button>
      </div>
      {wishes.length === 0 ? (
        <EmptyState
          title="No wishes recorded"
          description="Record your final wishes, funeral preferences, and important instructions for your loved ones."
          action={
            <Button asChild>
              <Link href="/wishes/new">Add your first wish</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishes.map((wish) => (
            <WishCard key={wish.id} {...wish} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-vixi-stone">Loading…</div>}>
      <WishesContent />
    </Suspense>
  );
}
