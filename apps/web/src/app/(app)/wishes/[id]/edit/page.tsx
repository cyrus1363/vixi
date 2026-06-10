import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getWish } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { WishForm } from "@/components/wish-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditWishPage({ params }: Params) {
  const session = await requireAuth();
  const { id } = await params;

  let wish;
  try {
    wish = await getWish(session.user.id, id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-vixi-stone">
        <Link href="/wishes" className="hover:underline">
          Final Wishes
        </Link>
        <span>/</span>
        <Link href={`/wishes/${id}`} className="hover:underline">
          {wish.title}
        </Link>
        <span>/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-vixi-dark">
        Edit Wish
      </h1>
      <div className="mt-6">
        <WishForm
          wishId={wish.id}
          defaultValues={{
            category: wish.category,
            title: wish.title,
            body: wish.body,
          }}
        />
      </div>
    </div>
  );
}
