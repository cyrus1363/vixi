import Link from "next/link";
import { Button } from "@vixi/ui";

export default function NewBeneficiaryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Add a trusted contact
      </h1>
      <p className="mt-2 text-vixi-stone">
        Designate someone to receive your legacy information.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <p className="text-vixi-stone">
          Contact creation form coming in Ticket 006.
        </p>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/beneficiaries">← Back to contacts</Link>
        </Button>
      </div>
    </div>
  );
}
