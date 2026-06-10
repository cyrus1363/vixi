import { Card, Skeleton } from "@vixi/ui";

export function VaultListSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </Card>
      ))}
    </div>
  );
}
