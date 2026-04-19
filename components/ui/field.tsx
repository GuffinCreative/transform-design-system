import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface FieldContextValue {
  id: string;
  invalid?: boolean;
}

const FieldContext = React.createContext<FieldContextValue>({ id: "" });

function useField() {
  return React.useContext(FieldContext);
}

// ─── Field ────────────────────────────────────────────────────────────────────

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Marks the field as invalid — turns label red and wires aria-invalid. */
  invalid?: boolean;
}

function Field({ className, invalid, children, ...props }: FieldProps) {
  const id = React.useId();
  return (
    <FieldContext.Provider value={{ id, invalid }}>
      <div
        className={cn("relative flex flex-col gap-3 items-start w-full", className)}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}
Field.displayName = "Field";

// ─── FieldLabel ───────────────────────────────────────────────────────────────

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, htmlFor, ...props }, ref) => {
  const { id, invalid } = useField();
  return (
    <label
      ref={ref}
      htmlFor={htmlFor ?? id}
      className={cn(
        "font-sans text-sm font-medium leading-5",
        invalid ? "text-destructive" : "text-foreground",
        className
      )}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

// ─── FieldLabelLink ───────────────────────────────────────────────────────────
// Optional helper link positioned top-right (e.g. "Forgot password?").

const FieldLabelLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "absolute right-0 top-0 font-sans text-sm text-foreground hover:underline",
      className
    )}
    {...props}
  />
));
FieldLabelLink.displayName = "FieldLabelLink";

// ─── FieldControl ─────────────────────────────────────────────────────────────
// Thin wrapper that wires id + aria-invalid onto the child input.

const FieldControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { id, invalid } = useField();

  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {React.cloneElement(child, {
        id: child.props.id ?? id,
        "aria-invalid": invalid ? true : undefined,
      })}
    </div>
  );
});
FieldControl.displayName = "FieldControl";

// ─── FieldDescription ─────────────────────────────────────────────────────────

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-sans text-sm text-muted-foreground leading-5", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

// ─── FieldError ───────────────────────────────────────────────────────────────

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { invalid } = useField();
  if (!invalid || !children) return null;
  return (
    <p
      ref={ref}
      role="alert"
      className={cn("font-sans text-sm text-destructive leading-5", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FieldError.displayName = "FieldError";

export {
  Field,
  FieldLabel,
  FieldLabelLink,
  FieldControl,
  FieldDescription,
  FieldError,
};
