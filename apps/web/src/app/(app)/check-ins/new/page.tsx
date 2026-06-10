import Link from "next/link";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { CheckInForm } from "@/components/check-in-form";

export default async function NewCheckInPage() {
  await requireAuth();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Schedule a check-in
      </h1>
      <p className="mt-2 text-vixi-stone">
        Set a future date to confirm you&apos;re still in control.
      </p>

      <Card className="mt-8 p-8">
        <CheckInForm mode="create" />
      </Card>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/check-ins">← Back to check-ins</Link>
        </Button>
      </div>
    </div>
  );
}
