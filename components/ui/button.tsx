import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "font-sans text-sm font-medium leading-5 select-none",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — orange brand CTA
        default:
          "bg-brand-primary text-white shadow-sm hover:bg-brand-midOrange active:bg-brand-primary/90",
        // Secondary — warm light orange
        secondary:
          "bg-brand-secondary text-brand-darkGreen shadow-sm hover:bg-brand-secondary/80 active:bg-brand-secondary/70",
        // Dark — flagship dark green (inverted primary)
        forest:
          "bg-brand-darkGreen text-brand-light shadow-sm hover:bg-brand-darkGreen/90 active:bg-brand-darkGreen/80",
        // Mid forest — softer green fill
        green:
          "bg-brand-midForest text-brand-light shadow-sm hover:bg-brand-midForest/90 active:bg-brand-midForest/80",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
        // Outline — white bg, subtle border + drop shadow matching Figma spec
        outline:
          "border border-input bg-background text-brand-darkGreen shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-brand-light hover:border-brand-alt active:bg-brand-light/80",
        // Ghost — no fill, darkens on hover
        ghost:
          "bg-transparent text-brand-darkGreen hover:bg-brand-light active:bg-brand-light/70",
        // Link — text-only, underline on hover
        link:
          "text-brand-primary underline-offset-4 hover:underline active:opacity-80",
      },
      size: {
        sm:      "h-8 rounded-md px-3 text-sm",
        default: "h-9 px-4 py-2",
        lg:      "h-10 rounded-md px-8",
        // Square icon sizes matching Figma icon-sm / icon / icon-lg
        "icon-sm": "size-8 rounded-md",
        icon:      "size-9",
        "icon-lg": "size-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Keyboard shortcut badge rendered after label, e.g. "⌘K" */
  kbd?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      kbd,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
        {!loading && kbd && (
          <kbd className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-white/20 px-1 font-sans text-xs font-medium leading-4 text-inherit opacity-80">
            {kbd}
          </kbd>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
