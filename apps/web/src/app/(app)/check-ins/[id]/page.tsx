import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CheckInStatus } from "@prisma/client";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Badge, Button, Card, type BadgeProps } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getCheckIn } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteCheckInButton } from "@/components/delete-check-in-button";
import { CheckInDetailSkeleton } from "./skeleton";

type Params = { params: Promise<{ id: string }> };

const statusVariant: Record<CheckInStatus, BadgeProps["variant"]> = {
  PENDING: "pending",
  RESPONDED: "responded",
  MISSED: "missed",
  ESCALATED: "escalated",
};

const statusLabel: Record<CheckInStatus, string> = {
  PENDING: "Pending",
  RESPONDED: "Responded",
  MISSED: "Missed",
  ESCALATED: "Escalated",
};

export default function CheckInDetailPage({ params }: Params) {
  return (
    <Suspense fallback={<CheckInDetailSkeleton />}>
      <CheckInDetailContent params={params} />
    </Suspense>
  );
}

async function CheckInDetailContent({ params }: Params) {
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link
          href="/check-ins"
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          Check-ins
        </Link>
        <span>/</span>
        <span>{scheduledDate.toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Check-in on {scheduledDate.toLocaleDateString()}
        </h1>
        <Badge variant={statusVariant[checkIn.status]}>
          {checkIn.status === "RESPONDED" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : checkIn.status === "MISSED" ? (
            <XCircle className="h-3 w-3" />
          ) : null}
          {statusLabel[checkIn.status]}
        </Badge>
      </div>

      <Card className="mt-6 p-6">
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
      </Card>

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
