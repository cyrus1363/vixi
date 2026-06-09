import Link from "next/link";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { BeneficiaryForm } from "@/components/beneficiary-form";

export default async function NewBeneficiaryPage() {
  await requireAuth();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Add a beneficiary
      </h1>
      <p className="mt-2 text-vixi-stone">
        Designate someone to receive your legacy.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <BeneficiaryForm mode="create" />
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/beneficiaries">← Back to beneficiaries</Link>
        </Button>
      </div>
    </div>
  );
}
