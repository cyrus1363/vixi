import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getBeneficiary } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { BeneficiaryForm } from "@/components/beneficiary-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditBeneficiaryPage({ params }: Params) {
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
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link
          href="/beneficiaries"
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          Beneficiaries
        </Link>
        <span>/</span>
        <Link
          href={`/beneficiaries/${beneficiary.id}`}
          className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
        >
          {beneficiary.name}
        </Link>
        <span>/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
        Edit beneficiary
      </h1>
      <p className="mt-2 text-vixi-stone">
        Update the details for this beneficiary.
      </p>

      <Card className="mt-8 p-8">
        <BeneficiaryForm
          mode="edit"
          beneficiaryId={beneficiary.id}
          defaultValues={{
            name: beneficiary.name,
            email: beneficiary.email,
            phone: beneficiary.phone ?? "",
            relationship: beneficiary.relationship ?? "",
            trusted: beneficiary.trusted,
            role: beneficiary.role,
            accessLevel: beneficiary.accessLevel,
            inviteStatus: beneficiary.inviteStatus,
          }}
        />
      </Card>
    </div>
  );
}
