import Link from "next/link";
import { Button } from "@vixi/ui";

export default function NewCheckInPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Schedule a check-in
      </h1>
      <p className="mt-2 text-vixi-stone">
        Configure a periodic wellness reminder to keep your plan active.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <p className="text-vixi-stone">
          Check-in configuration form coming in Ticket 008.
        </p>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/check-ins">← Back to check-ins</Link>
        </Button>
      </div>
    </div>
  );
}
