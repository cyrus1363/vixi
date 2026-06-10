import Link from "next/link";
import { Suspense } from "react";
import { Clock } from "lucide-react";
import { Button, EmptyState } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getCheckIns } from "@/lib/services";
import { CheckInCard } from "@/components/check-in-card";
import { CheckInListSkeleton } from "./skeleton";

export default function CheckInsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Your Check-ins
          </h1>
          <p className="mt-2 text-vixi-stone">
            Scheduled check-ins to confirm you&apos;re still in control.
          </p>
        </div>
        <Button asChild>
          <Link href="/check-ins/new">+ New check-in</Link>
        </Button>
      </div>

      <Suspense fallback={<CheckInListSkeleton />}>
        <CheckInsContent />
      </Suspense>
    </div>
  );
}

async function CheckInsContent() {
  const session = await requireAuth();
  const checkIns = await getCheckIns(session.user.id);

  if (checkIns.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No check-ins yet"
        description="Schedule regular check-ins so we know your legacy should remain sealed."
        action={
          <Button asChild>
            <Link href="/check-ins/new">Schedule your first check-in</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {checkIns.map((checkIn) => (
        <CheckInCard
          key={checkIn.id}
          id={checkIn.id}
          scheduledAt={checkIn.scheduledAt}
          status={checkIn.status}
          completedAt={checkIn.completedAt}
        />
      ))}
    </div>
  );
}
