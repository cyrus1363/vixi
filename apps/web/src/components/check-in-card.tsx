import Link from "next/link";
import { Calendar } from "lucide-react";
import { CheckInStatus } from "@prisma/client";

const statusColors: Record<
  CheckInStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "bg-stone-100", text: "text-vixi-stone", label: "Pending" },
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
  const colors = statusColors[status] ?? statusColors.PENDING;
  const date = new Date(scheduledAt);

  return (
    <Link
      href={`/check-ins/${id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-vixi-teal hover:shadow-md"
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
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {colors.label}
        </span>
      </div>
      {completedAt && (
        <p className="mt-3 text-xs text-vixi-stone">
          Completed: {new Date(completedAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
