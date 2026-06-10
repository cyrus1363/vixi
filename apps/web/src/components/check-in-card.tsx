import Link from "next/link";
import { Calendar } from "lucide-react";
import { CheckInStatus } from "@prisma/client";
import { Badge, type BadgeProps } from "@vixi/ui";

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

type CheckInCardProps = {
  id: string;
  scheduledAt: Date;
  status: CheckInStatus;
  completedAt: Date | null;
};

export function CheckInCard({
  id,
  scheduledAt,
  status,
  completedAt,
}: CheckInCardProps) {
  const date = new Date(scheduledAt);

  return (
    <Link
      href={`/check-ins/${id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-vixi-dark">
            <Calendar className="h-4 w-4 text-vixi-stone" />
            {date.toLocaleDateString()}
          </div>
          <p className="mt-1 text-xs text-vixi-stone">
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <Badge variant={statusVariant[status]}>
          {statusLabel[status]}
        </Badge>
      </div>
      {completedAt && (
        <p className="mt-3 text-xs text-vixi-stone">
          Completed: {new Date(completedAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
