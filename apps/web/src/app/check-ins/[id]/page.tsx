import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getCheckIn } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteCheckInButton } from "@/components/delete-check-in-button";

type Params = { params: Promise<{ id: string }> };

const statusColors: Record<string, { bg: string; text: string; label: string }> =
  {
    PENDING: {
      bg: "bg-stone-100",
      text: "text-vixi-stone",
      label: "Pending",
    },
    RESPONDED: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Responded",
    },
    MISSED: { bg: "bg-red-100", text: "text-red-700", label: "Missed" },
    ESCALATED: {
      bg: "bg-vixi-gold/20",
      text: "text-vixi-dark",
      label: "Escalated",
    },
  };

export default async function CheckInDetailPage({ params }: Params) {
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

  const colors = statusColors[checkIn.status] ?? statusColors.PENDING;
  const scheduledDate = new Date(checkIn.scheduledAt);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/check-ins" className="hover:underline">
          Check-ins
        </Link>
        <span>/</span>
        <span>{scheduledDate.toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Check-in on {scheduledDate.toLocaleDateString()}
        </h1>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {checkIn.status === "RESPONDED" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : checkIn.status === "MISSED" ? (
            <XCircle className="h-3 w-3" />
          ) : null}
          {colors.label}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-vixi-stone" />
            <div>
              <dt className="text-xs text-vixi-stone">Scheduled for</dt>
              <dd className="text-sm text-vixi-dark">
                {scheduledDate.toLocaleString()}
              </dd>
            </div>
          </div>
          {checkIn.completedAt && (
            <div>
              <dt className="text-xs text-vixi-stone">Completed at</dt>
              <dd className="text-sm text-vixi-dark">
                {new Date(checkIn.completedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={`/check-ins/${checkIn.id}/edit`}>Edit check-in</Link>
        </Button>
        <DeleteCheckInButton
          checkInId={checkIn.id}
          scheduledDate={scheduledDate.toLocaleDateString()}
        />
      </div>
    </div>
  );
}
