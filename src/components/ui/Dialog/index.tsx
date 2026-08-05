import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;
const Portal = DialogPrimitive.Portal;

const Overlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm", className)}
    {...props}
  />
));
Overlay.displayName = "DialogOverlay";

const Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const t = useT();
  return (
  <Portal>
    <Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface p-4 shadow-2xl sm:w-full sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
      <Close className="absolute right-4 top-4 rounded-lg p-1 text-faint transition-colors hover:bg-canvas hover:text-ink">
        <X className="h-4 w-4" />
        <span className="sr-only">{t("common.close")}</span>
      </Close>
    </DialogPrimitive.Content>
  </Portal>
  );
});
Content.displayName = "DialogContent";

const Title = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-display text-lg font-bold text-ink", className)}
    {...props}
  />
));
Title.displayName = "DialogTitle";

const Description = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mt-1 text-sm text-muted", className)}
    {...props}
  />
));
Description.displayName = "DialogDescription";

export const Dialog = { Root, Trigger, Close, Content, Title, Description };
