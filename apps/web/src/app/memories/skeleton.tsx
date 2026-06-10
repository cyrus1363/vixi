import { Card, Skeleton } from "@vixi/ui";

export function MemoryListSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i}>
          <Skeleton className="h-40 w-full rounded-t-xl rounded-b-none" />
          <div className="p-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </div>
        </Card>
      ))}
    </div>
  );
}
