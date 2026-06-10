import Link from "next/link";
import { Button } from "@vixi/ui";

export default function CheckInNotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="font-heading text-4xl font-bold tracking-tight text-vixi-dark">
        Check-in not found
      </h1>
      <p className="mt-4 text-vixi-stone">
        This check-in doesn&apos;t exist or has been deleted.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/check-ins">Back to check-ins</Link>
        </Button>
      </div>
    </div>
  );
}
