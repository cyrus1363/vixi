import * as React from "react";
import { cn } from "./utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "motion-safe:animate-pulse rounded bg-stone-200",
        className
      )}
      {...props}
    />
  );
}
