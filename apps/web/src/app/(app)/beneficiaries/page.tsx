import Link from "next/link";
import { Suspense } from "react";
import { Users } from "lucide-react";
import { Button, EmptyState } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getBeneficiaries } from "@/lib/services";
import { BeneficiaryCard } from "@/components/beneficiary-card";
import { BeneficiaryListSkeleton } from "./skeleton";

export default function BeneficiariesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Trusted Contacts
          </h1>
          <p className="mt-2 text-vixi-stone">
            People you trust to receive your legacy.
          </p>
        </div>
        <Button asChild>
          <Link href="/beneficiaries/new">+ New beneficiary</Link>
        </Button>
      </div>

      <Suspense fallback={<BeneficiaryListSkeleton />}>
        <BeneficiariesContent />
      </Suspense>
    </div>
  );
}

async function BeneficiariesContent() {
  const session = await requireAuth();
  const beneficiaries = await getBeneficiaries(session.user.id);

  if (beneficiaries.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No beneficiaries yet"
        description="Add the people who should receive access to your legacy when the time comes."
        action={
          <Button asChild>
            <Link href="/beneficiaries/new">Add your first beneficiary</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {beneficiaries.map((beneficiary) => (
        <BeneficiaryCard
          key={beneficiary.id}
          id={beneficiary.id}
          name={beneficiary.name}
          email={beneficiary.email}
          relationship={beneficiary.relationship}
          trusted={beneficiary.trusted}
          role={beneficiary.role}
        />
      ))}
    </div>
  );
}
