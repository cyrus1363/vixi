import Link from "next/link";
import { Button } from "@vixi/ui";
import { CheckInForm } from "@/components/check-in-form";

export default function NewCheckInPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Schedule a check-in
      </h1>
      <p className="mt-2 text-vixi-stone">
        Set a future date to confirm you&apos;re still in control.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8">
        <CheckInForm mode="create" />
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/check-ins">← Back to check-ins</Link>
        </Button>
      </div>
    </div>
  );
}
