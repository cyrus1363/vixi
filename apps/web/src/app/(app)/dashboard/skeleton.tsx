import { Card, Skeleton } from "@vixi/ui";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="mt-2 h-4 w-1/3" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-8 w-12" />
            <Skeleton className="mt-2 h-3 w-full" />
          </Card>
        ))}
      </div>

      <Card className="mt-10 p-6">
        <Skeleton className="h-6 w-32" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-44" />
        </div>
      </Card>
    </div>
  );
}
