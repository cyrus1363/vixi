import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Mail, Phone, Shield, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getBeneficiary } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteBeneficiaryButton } from "@/components/delete-beneficiary-button";
import { BeneficiaryDetailSkeleton } from "./skeleton";

type Params = { params: Promise<{ id: string }> };

export default function BeneficiaryDetailPage({ params }: Params) {
  return (
    <Suspense fallback={<BeneficiaryDetailSkeleton />}>
      <BeneficiaryDetailContent params={params} />
    </Suspense>
  );
}

async function BeneficiaryDetailContent({ params }: Params) {
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
        <Link
          href="/beneficiaries"
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          Beneficiaries
        </Link>
        <span>/</span>
        <span>{beneficiary.name}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {beneficiary.name}
        </h1>
        {beneficiary.trusted ? (
          <Badge variant="trusted">
            <ShieldCheck className="h-3 w-3" />
            Trusted
          </Badge>
        ) : (
          <Badge variant="standard">
            <Shield className="h-3 w-3" />
            Standard
          </Badge>
        )}
      </div>

      <Card className="mt-6 p-6">
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
      </Card>

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
