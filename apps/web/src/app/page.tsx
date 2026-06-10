import Link from "next/link";
import { Button } from "@vixi/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-vixi-teal" />
          <span className="text-xl font-semibold tracking-tight">Vixi</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded text-sm font-medium text-vixi-stone outline-none hover:text-vixi-dark focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2"
          >
            Log in
          </Link>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-vixi-dark sm:text-5xl lg:text-6xl">
          Plan your legacy. <br />
          <span className="text-vixi-teal">Preserve what matters.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-vixi-stone">
          Vixi helps you organize important documents, capture cherished
          memories, and ensure your loved ones are cared for — all in one secure
          place.
        </p>
        <div className="mt-10 flex gap-4">
          <Button
            size="lg"
            className="bg-vixi-gold text-white hover:bg-vixi-gold/90 focus-visible:ring-vixi-gold"
            asChild
          >
            <Link href="/register">Start your legacy</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-sm text-vixi-stone">
        © {new Date().getFullYear()} Vixi. Built with care.
      </footer>
    </div>
  );
}
