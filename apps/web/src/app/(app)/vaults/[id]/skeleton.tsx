import { Card, Skeleton } from "@vixi/ui";

export function VaultDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-8 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="mt-2 h-5 w-20" />
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
