import Link from "next/link";
import { Button } from "@vixi/ui";

export default function BeneficiariesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Trusted Contacts
      </h1>
      <p className="mt-2 text-vixi-stone">
        People you&apos;ve designated to receive your legacy.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
        <div className="mb-4 text-4xl">👥</div>
        <h2 className="text-xl font-semibold text-vixi-dark">
          No contacts yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-vixi-stone">
          Add your first trusted contact — a spouse, family member, or attorney
          who will receive your legacy when the time comes.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/beneficiaries/new">Add your first contact</Link>
        </Button>
      </div>
    </div>
  );
}
