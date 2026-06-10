import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card } from "@vixi/ui";
import { requireAuth } from "@/lib/auth";
import { getWish } from "@/lib/services";
import { NotFoundError } from "@/lib/errors";
import { DeleteWishButton } from "@/components/delete-wish-button";

const CATEGORY_LABELS: Record<string, string> = {
  FUNERAL_PREFERENCE: "Funeral Preference",
  BURIAL_CREMATION: "Burial / Cremation",
  PEOPLE_TO_NOTIFY: "People to Notify",
  PET_CARE: "Pet Care",
  DIGITAL_ACCOUNTS: "Digital Accounts",
  LEGAL_NOTES: "Legal Notes",
  OTHER: "Other",
};

type Params = { params: Promise<{ id: string }> };

export default async function WishDetailPage({ params }: Params) {
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
        <span>{wish.title}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-vixi-dark">
          {wish.title}
        </h1>
        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone">
          {CATEGORY_LABELS[wish.category] ?? wish.category}
        </span>
      </div>
      <Card className="mt-6 p-6">
        <p className="whitespace-pre-wrap text-vixi-dark">{wish.body}</p>
      </Card>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={`/wishes/${wish.id}/edit`}>Edit wish</Link>
        </Button>
        <DeleteWishButton wishId={wish.id} wishTitle={wish.title} />
      </div>
    </div>
  );
}
