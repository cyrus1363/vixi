import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getBeneficiaries } from "@/lib/services";
import { BeneficiaryCard } from "@/components/beneficiary-card";

export default async function BeneficiariesPage() {
  const session = await requireAuth();
  const beneficiaries = await getBeneficiaries(session.user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Beneficiaries
          </h1>
          <p className="mt-2 text-vixi-stone">
            People you trust to receive your legacy.
          </p>
        </div>
        <Button asChild>
          <Link href="/beneficiaries/new">+ New beneficiary</Link>
        </Button>
      </div>

      {beneficiaries.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <Users className="mb-4 h-12 w-12 text-stone-400" />
          <h2 className="text-xl font-semibold text-vixi-dark">
            No beneficiaries yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-vixi-stone">
            Add the people who should receive access to your legacy when the
            time comes.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/beneficiaries/new">Add your first beneficiary</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficiaries.map((beneficiary) => (
            <BeneficiaryCard
              key={beneficiary.id}
              id={beneficiary.id}
              name={beneficiary.name}
              email={beneficiary.email}
              relationship={beneficiary.relationship}
              trusted={beneficiary.trusted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
