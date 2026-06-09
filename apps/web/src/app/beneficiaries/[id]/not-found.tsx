import Link from "next/link";
import { Button } from "@vixi/ui";

export default function BeneficiaryNotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-vixi-dark">
        Beneficiary not found
      </h1>
      <p className="mt-4 text-vixi-stone">
        This beneficiary doesn&apos;t exist or has been removed.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/beneficiaries">Back to beneficiaries</Link>
        </Button>
      </div>
    </div>
  );
}
