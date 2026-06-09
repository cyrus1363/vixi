import Link from "next/link";
import Image from "next/image";

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
      className="block rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-vixi-teal hover:shadow-md"
    >
      {mediaUrl && (
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-stone-100">
          <Image
            src={mediaUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-vixi-dark">
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
