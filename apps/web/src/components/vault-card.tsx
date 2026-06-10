import Link from "next/link";
import type { VaultType, VaultStatus } from "@prisma/client";
import { Badge, type BadgeProps } from "@vixi/ui";

const VAULT_TYPE_LABELS: Record<VaultType, string> = {
  GENERAL: "General",
  WILL: "Will",
  INSURANCE: "Insurance",
  FINANCIAL: "Financial",
  DIGITAL_ASSETS: "Digital Assets",
  MESSAGES: "Messages",
};

const VAULT_STATUS_VARIANT: Record<VaultStatus, BadgeProps["variant"]> = {
  ACTIVE: "active",
  SEALED: "sealed",
  UNLOCKED: "unlocked",
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
      className="block rounded-xl border border-stone-200 bg-white p-6 shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-lg font-bold text-vixi-dark">{name}</h3>
        <Badge variant={VAULT_STATUS_VARIANT[status]}>
          {status.toLowerCase()}
        </Badge>
      </div>
      {description && (
        <p className="mt-2 line-clamp-2 text-sm text-vixi-stone">
          {description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-vixi-stone">
        <Badge variant="neutral">{VAULT_TYPE_LABELS[type]}</Badge>
        <span>
          {contentCount} {contentCount === 1 ? "item" : "items"}
        </span>
      </div>
    </Link>
  );
}
