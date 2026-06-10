import * as React from "react";
import { cn } from "./utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white shadow-sm",
        hoverable &&
          "cursor-pointer motion-safe:transition motion-safe:hover:border-vixi-teal motion-safe:hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
