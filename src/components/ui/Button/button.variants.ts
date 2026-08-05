import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-colors disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
        secondary: "bg-brand-soft text-brand-dark hover:bg-brand-soft/70",
        outline: "border border-line bg-white text-ink hover:bg-canvas",
        ghost: "text-muted hover:bg-canvas hover:text-ink",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
