import * as React from "react";
import { cn } from "@/lib/utils";

// ─── InputGroup ───────────────────────────────────────────────────────────────
// Replaces the plain <Input> border+bg shell. Place <InputGroupAddon> and a
// bare <input> (or <Input> with className="border-0 bg-transparent shadow-none
// focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-0 px-0") inside.

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-1",
      "font-sans text-sm",
      "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
      "transition-colors",
      "focus-within:outline-none focus-within:ring-2",
      "focus-within:ring-brand-outline/50 focus-within:ring-offset-2",
      "aria-[invalid=true]:border-destructive",
      className
    )}
    {...props}
  />
));
InputGroup.displayName = "InputGroup";

// ─── InputGroupAddon ──────────────────────────────────────────────────────────
// Inline decorator — wraps an icon, text prefix/suffix, Kbd hint, or small
// button. Sits flush inside the InputGroup border.

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex shrink-0 items-center justify-center text-muted-foreground",
      "[&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";

// ─── InputGroupBlock ──────────────────────────────────────────────────────────
// Above / below bar — lives outside the InputGroup border. Typical use:
// character count, status text, action button.

const InputGroupBlock = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-3 py-1.5",
      "font-sans text-sm font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
));
InputGroupBlock.displayName = "InputGroupBlock";

// ─── InputGroupSeparator ──────────────────────────────────────────────────────
// Thin vertical divider between inline addons inside an InputGroup.

const InputGroupSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-4 w-px shrink-0 bg-border", className)}
    {...props}
  />
));
InputGroupSeparator.displayName = "InputGroupSeparator";

export { InputGroup, InputGroupAddon, InputGroupBlock, InputGroupSeparator };
