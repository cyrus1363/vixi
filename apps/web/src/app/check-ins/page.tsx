import Link from "next/link";
import { Button } from "@vixi/ui";

export default function CheckInsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Check-Ins
      </h1>
      <p className="mt-2 text-vixi-stone">
        Periodic wellness checks to ensure your legacy plan stays up to date.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
        <div className="mb-4 text-4xl">⏰</div>
        <h2 className="text-xl font-semibold text-vixi-dark">
          No check-ins scheduled
        </h2>
        <p className="mt-2 max-w-sm text-sm text-vixi-stone">
          Set up your first wellness check-in to keep your legacy plan active
          and current.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/check-ins/new">Schedule your first check-in</Link>
        </Button>
      </div>
    </div>
  );
}
