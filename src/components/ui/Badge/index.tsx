import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Inline colors let feature meta objects (fg/bg) drive the badge. */
  fg?: string;
  bg?: string;
};

export function Badge({ className, fg, bg, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      style={{ color: fg, background: bg, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
