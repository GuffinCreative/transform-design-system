import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1",
        "font-sans text-sm text-foreground",
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        "placeholder:text-muted-foreground",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand-outline/50 focus-visible:ring-offset-2",
        "aria-[invalid=true]:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ─── PasswordInput ────────────────────────────────────────────────────────────

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-9", className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground",
            "focus-visible:outline-none"
          )}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
