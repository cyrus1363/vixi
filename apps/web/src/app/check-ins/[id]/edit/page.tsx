import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCheckIn } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { CheckInForm } from "@/components/check-in-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditCheckInPage({ params }: Params) {
  const session = await requireAuth();
  const { id } = await params;

  let checkIn;
  try {
    checkIn = await getCheckIn(session.user.id, id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    throw err;
  }

  const scheduledDate = new Date(checkIn.scheduledAt);
  const completedDate = checkIn.completedAt
    ? new Date(checkIn.completedAt)
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/check-ins" className="hover:underline">
          Check-ins
        </Link>
        <span>/</span>
        <Link
          href={`/check-ins/${checkIn.id}`}
          className="hover:underline"
        >
          {scheduledDate.toLocaleDateString()}
        </Link>
        <span>/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Edit check-in
      </h1>
      <p className="mt-2 text-vixi-stone">
        Update the schedule or status for this check-in.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <CheckInForm
          mode="edit"
          checkInId={checkIn.id}
          defaultValues={{
            scheduledAt: scheduledDate,
            status: checkIn.status,
            completedAt: completedDate ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
