import Link from "next/link";
import { WishForm } from "@/components/wish-form";

export default function NewWishPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/wishes" className="hover:underline">
          Final Wishes
        </Link>
        <span>/</span>
        <span>New</span>
      </div>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-vixi-dark">
        Add a Wish
      </h1>
      <div className="mt-6">
        <WishForm />
      </div>
    </div>
  );
}
