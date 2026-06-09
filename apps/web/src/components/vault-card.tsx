import Link from "next/link";
import type { VaultType, VaultStatus } from "@prisma/client";

const VAULT_TYPE_LABELS: Record<VaultType, string> = {
  GENERAL: "General",
  WILL: "Will",
  INSURANCE: "Insurance",
  FINANCIAL: "Financial",
  DIGITAL_ASSETS: "Digital Assets",
  MESSAGES: "Messages",
};

const VAULT_STATUS_STYLES: Record<VaultStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SEALED: "bg-amber-100 text-amber-700",
  UNLOCKED: "bg-sky-100 text-sky-700",
};

type VaultCardProps = {
  id: string;
  name: string;
  description: string | null;
  type: VaultType;
  status: VaultStatus;
  contentCount: number;
};

export function VaultCard({
  id,
  name,
  description,
  type,
  status,
  contentCount,
}: VaultCardProps) {
  return (
    <Link
      href={`/vaults/${id}`}
      className="block rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-vixi-teal hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-vixi-dark">{name}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${VAULT_STATUS_STYLES[status]}`}
        >
          {status.toLowerCase()}
        </span>
      </div>
      {description && (
        <p className="mt-2 line-clamp-2 text-sm text-vixi-stone">
          {description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-vixi-stone">
        <span className="rounded-md bg-stone-100 px-2 py-0.5 font-medium">
          {VAULT_TYPE_LABELS[type]}
        </span>
        <span>
          {contentCount} {contentCount === 1 ? "item" : "items"}
        </span>
      </div>
    </Link>
  );
}
