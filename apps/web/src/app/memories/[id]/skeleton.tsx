import { Card, Skeleton } from "@vixi/ui";

export function MemoryDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-8 w-2/3" />
      <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      <Card className="mt-6 p-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </Card>
    </div>
  );
}
