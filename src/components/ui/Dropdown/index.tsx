import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";

const Root = DropdownPrimitive.Root;
const Trigger = DropdownPrimitive.Trigger;

const Content = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[11rem] rounded-xl border border-line bg-surface p-1 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  </DropdownPrimitive.Portal>
));
Content.displayName = "DropdownContent";

const Item = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink outline-none transition-colors data-[highlighted]:bg-canvas",
      className,
    )}
    {...props}
  />
));
Item.displayName = "DropdownItem";

const Label = DropdownPrimitive.Label;
const Separator = DropdownPrimitive.Separator;

export const Dropdown = { Root, Trigger, Content, Item, Label, Separator };
