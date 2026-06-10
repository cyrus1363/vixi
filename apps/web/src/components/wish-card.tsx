import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  FUNERAL_PREFERENCE: "Funeral Preference",
  BURIAL_CREMATION: "Burial / Cremation",
  PEOPLE_TO_NOTIFY: "People to Notify",
  PET_CARE: "Pet Care",
  DIGITAL_ACCOUNTS: "Digital Accounts",
  LEGAL_NOTES: "Legal Notes",
  OTHER: "Other",
};

type WishCardProps = {
  id: string;
  category: string;
  title: string;
  body: string;
};

export function WishCard({ id, category, title, body }: WishCardProps) {
  return (
    <Link
      href={`/wishes/${id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
    >
      <span className="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-vixi-stone">
        {CATEGORY_LABELS[category] ?? category}
      </span>
      <h3 className="mt-2 line-clamp-1 font-heading text-lg font-bold text-vixi-dark">
        {title}
      </h3>
      <p className="mt-1 line-clamp-3 text-sm text-vixi-stone">{body}</p>
    </Link>
  );
}
