import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getBeneficiary } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteBeneficiaryButton } from "@/components/delete-beneficiary-button";

type Params = { params: Promise<{ id: string }> };

export default async function BeneficiaryDetailPage({ params }: Params) {
  const session = await requireAuth();
  const { id } = await params;

  let beneficiary;
  try {
    beneficiary = await getBeneficiary(session.user.id, id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/beneficiaries" className="hover:underline">
          Beneficiaries
        </Link>
        <span>/</span>
        <span>{beneficiary.name}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {beneficiary.name}
        </h1>
        {beneficiary.trusted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-vixi-teal/10 px-2 py-0.5 text-xs font-medium text-vixi-teal">
            <ShieldCheck className="h-3 w-3" />
            Trusted
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone">
            <Shield className="h-3 w-3" />
            Standard
          </span>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-vixi-stone" />
            <div>
              <dt className="text-xs text-vixi-stone">Email</dt>
              <dd className="text-sm text-vixi-dark">{beneficiary.email}</dd>
            </div>
          </div>
          {beneficiary.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-vixi-stone" />
              <div>
                <dt className="text-xs text-vixi-stone">Phone</dt>
                <dd className="text-sm text-vixi-dark">
                  {beneficiary.phone}
                </dd>
              </div>
            </div>
          )}
          {beneficiary.relationship && (
            <div>
              <dt className="text-xs text-vixi-stone">Relationship</dt>
              <dd className="text-sm text-vixi-dark">
                {beneficiary.relationship}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={`/beneficiaries/${beneficiary.id}/edit`}>
            Edit beneficiary
          </Link>
        </Button>
        <DeleteBeneficiaryButton
          beneficiaryId={beneficiary.id}
          beneficiaryName={beneficiary.name}
        />
      </div>
    </div>
  );
}
