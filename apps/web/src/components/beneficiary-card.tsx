import Link from "next/link";
import { Mail, ShieldCheck, Shield } from "lucide-react";
import { Badge } from "@vixi/ui";

const ROLE_LABELS: Record<string, string> = {
  EXECUTOR: "Executor",
  BENEFICIARY: "Beneficiary",
  EMERGENCY_CONTACT: "Emergency Contact",
  MEMORY_RECIPIENT: "Memory Recipient",
  PET_CARETAKER: "Pet Caretaker",
  FUNERAL_CONTACT: "Funeral Contact",
};

type BeneficiaryCardProps = {
  id: string;
  name: string;
  email: string;
  relationship: string | null;
  trusted: boolean;
  role: string;
};

export function BeneficiaryCard({
  id,
  name,
  email,
  relationship,
  trusted,
  role,
}: BeneficiaryCardProps) {
  return (
    <Link
      href={`/beneficiaries/${id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="line-clamp-1 font-heading text-lg font-bold text-vixi-dark">
            {name}
          </h3>
          {relationship && (
            <p className="mt-0.5 text-xs text-vixi-stone">{relationship}</p>
          )}
          <span className="mt-1 inline-block rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-vixi-stone">
            {ROLE_LABELS[role] ?? role}
          </span>
        </div>
        {trusted ? (
          <Badge variant="trusted" title="Trusted beneficiary">
            <ShieldCheck className="h-3 w-3" />
            Trusted
          </Badge>
        ) : (
          <Badge variant="standard" title="Standard beneficiary">
            <Shield className="h-3 w-3" />
            Standard
          </Badge>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-vixi-stone">
        <Mail className="h-4 w-4" />
        <span className="line-clamp-1">{email}</span>
      </div>
    </Link>
  );
}
