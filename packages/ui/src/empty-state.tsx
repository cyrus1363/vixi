import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center",
        className
      )}
    >
      {Icon ? (
        <Icon className="mb-4 h-12 w-12 text-stone-400" aria-hidden="true" />
      ) : (
        <div className="mb-4 text-4xl" aria-hidden="true">
          {""}
        </div>
      )}
      <h2 className="font-heading text-xl font-bold text-vixi-dark">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-vixi-stone">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
