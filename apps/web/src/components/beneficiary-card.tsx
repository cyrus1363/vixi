import Link from "next/link";
import { Mail, ShieldCheck, Shield } from "lucide-react";

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
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-vixi-teal hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-vixi-dark">
            {name}
          </h3>
          {relationship && (
            <p className="mt-0.5 text-xs text-vixi-stone">{relationship}</p>
          )}
        </div>
        {trusted ? (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-vixi-teal/10 px-2 py-0.5 text-xs font-medium text-vixi-teal"
            title="Trusted beneficiary"
          >
            <ShieldCheck className="h-3 w-3" />
            Trusted
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone"
            title="Standard beneficiary"
          >
            <Shield className="h-3 w-3" />
            Standard
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-vixi-stone">
        <Mail className="h-4 w-4" />
        <span className="line-clamp-1">{email}</span>
      </div>
    </Link>
  );
}
