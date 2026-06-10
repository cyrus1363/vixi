import { Card, Skeleton } from "@vixi/ui";

export function CheckInDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-40" />
      <div className="mt-2 flex items-center gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Card className="mt-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1 h-4 w-40" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
