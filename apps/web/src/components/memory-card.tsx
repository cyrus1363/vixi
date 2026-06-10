import Link from "next/link";

type MemoryCardProps = {
  id: string;
  title: string;
  body: string;
  mediaUrl: string | null;
  tags: string[];
};

export function MemoryCard({
  id,
  title,
  body,
  mediaUrl,
  tags,
}: MemoryCardProps) {
  return (
    <Link
      href={`/memories/${id}`}
      className="block rounded-xl border border-stone-200 bg-white shadow-sm outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md"
    >
      {mediaUrl && (
        <div className="flex items-center rounded-t-xl border-b border-stone-100 bg-stone-50 px-5 py-3">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="truncate text-sm text-vixi-teal underline underline-offset-2 hover:text-vixi-dark"
          >
            View media ↗
          </a>
        </div>
      )}
      <div className="p-5">
        <h3 className="line-clamp-1 font-heading text-lg font-bold text-vixi-dark">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-vixi-stone">{body}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-vixi-stone"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-vixi-stone">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
