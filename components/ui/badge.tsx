import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-sans font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        // Primary brand — orange
        default:
          "border-transparent bg-brand-primary text-white hover:bg-brand-midOrange",
        // Secondary brand — warm light orange
        secondary:
          "border-transparent bg-brand-secondary text-brand-darkGreen hover:bg-brand-secondary/80",
        // Dark green — flagship dark brand tone
        forest:
          "border-transparent bg-brand-darkGreen text-brand-light hover:bg-brand-darkGreen/90",
        // Mid-forest — softer green
        green:
          "border-transparent bg-brand-midForest text-brand-light hover:bg-brand-midForest/90",
        // Outlined — dark green border, transparent fill
        outline:
          "border-brand-outline text-brand-outline bg-transparent hover:bg-brand-outline/10",
        // Accent — warm yellow highlight
        accent:
          "border-transparent bg-brand-accent text-brand-darkGreen hover:bg-brand-accent/80",
        // Tan — neutral warm tone
        tan:
          "border-transparent bg-brand-tan text-brand-darkGreen hover:bg-brand-tan/80",
        // Muted — low-emphasis informational
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        // Semantic states
        success:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
      size: {
        sm: "px-2 py-0 text-[10px] leading-5",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
