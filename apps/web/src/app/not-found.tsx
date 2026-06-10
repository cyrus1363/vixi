import Link from "next/link";
import { Button } from "@vixi/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-vixi-teal" />
        <span className="text-xl font-semibold tracking-tight">Vixi</span>
      </div>

      <h1 className="font-heading text-4xl font-bold tracking-tight text-vixi-dark">
        404
      </h1>
      <p className="mt-4 text-lg text-vixi-stone">
        This page doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
