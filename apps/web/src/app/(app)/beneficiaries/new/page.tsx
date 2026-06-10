import Link from "next/link";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { BeneficiaryForm } from "@/components/beneficiary-form";

export default async function NewBeneficiaryPage() {
  await requireAuth();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Add a beneficiary
      </h1>
      <p className="mt-2 text-vixi-stone">
        Designate someone to receive your legacy.
      </p>

      <Card className="mt-8 p-8">
        <BeneficiaryForm mode="create" />
      </Card>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/beneficiaries">← Back to beneficiaries</Link>
        </Button>
      </div>
    </div>
  );
}
