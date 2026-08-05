import * as React from "react";
import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-xl border bg-canvas px-4 font-sans text-[15px] font-semibold text-ink outline-none transition-colors placeholder:font-medium placeholder:text-faint",
          "focus:border-brand focus:bg-white",
          invalid ? "border-red-400" : "border-line",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
