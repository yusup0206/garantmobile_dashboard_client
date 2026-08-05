import * as React from "react";
import { cn } from "@/lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border bg-canvas px-4 pr-10 font-sans text-[15px] font-semibold text-ink outline-none transition-colors",
            "focus:border-brand focus:bg-white",
            invalid ? "border-red-400" : "border-line",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {/* Chevron icon — pointer-events-none so clicks pass through to the select */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    );
  },
);

Select.displayName = "Select";
