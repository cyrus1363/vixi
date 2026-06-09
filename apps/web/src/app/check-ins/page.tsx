import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getCheckIns } from "@/lib/services";
import { CheckInCard } from "@/components/check-in-card";

export default async function CheckInsPage() {
  const session = await requireAuth();
  const checkIns = await getCheckIns(session.user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
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

      {checkIns.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <Clock className="mb-4 h-12 w-12 text-stone-400" />
          <h2 className="text-xl font-semibold text-vixi-dark">
            No check-ins yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-vixi-stone">
            Schedule regular check-ins so we know your legacy should remain
            sealed.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/check-ins/new">Schedule your first check-in</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </div>
  );
}
