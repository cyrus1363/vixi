import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        trusted: "bg-vixi-teal/10 text-vixi-teal",
        sealed: "bg-amber-100 text-amber-700",
        active: "bg-emerald-100 text-emerald-700",
        escalated: "bg-vixi-gold/20 text-vixi-dark",
        missed: "bg-red-100 text-red-700",
        responded: "bg-green-100 text-green-700",
        pending: "bg-stone-100 text-vixi-stone",
        standard: "bg-stone-100 text-vixi-stone",
        unlocked: "bg-sky-100 text-sky-700",
        neutral: "bg-stone-100 text-vixi-stone",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
