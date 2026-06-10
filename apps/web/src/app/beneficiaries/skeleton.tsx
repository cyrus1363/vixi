import { Card, Skeleton } from "@vixi/ui";

export function BeneficiaryListSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}
