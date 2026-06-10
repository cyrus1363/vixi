import Link from "next/link";
import { Mail, ShieldCheck, Shield } from "lucide-react";
import { Badge } from "@vixi/ui";

type BeneficiaryCardProps = {
  id: string;
  name: string;
  email: string;
  relationship: string | null;
  trusted: boolean;
};

export function BeneficiaryCard({
  id,
  name,
  email,
  relationship,
  trusted,
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
