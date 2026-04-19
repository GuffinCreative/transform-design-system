import * as React from "react";
import {
  useFormContext,
  FormProvider,
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

// ─── Form ─────────────────────────────────────────────────────────────────────

const Form = FormProvider;

// ─── FormField context ────────────────────────────────────────────────────────

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField must be used inside <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

// ─── FormItem context ─────────────────────────────────────────────────────────

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

// ─── FormItem ─────────────────────────────────────────────────────────────────

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("relative flex flex-col gap-3 items-start w-full", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// ─── FormLabel ────────────────────────────────────────────────────────────────

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <label
      ref={ref}
      htmlFor={formItemId}
      className={cn(
        "font-sans text-sm font-medium leading-5",
        error ? "text-destructive" : "text-foreground",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// ─── FormControl ──────────────────────────────────────────────────────────────

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {React.cloneElement(child, {
        id: formItemId,
        "aria-describedby": error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId,
        "aria-invalid": error ? true : undefined,
      })}
    </div>
  );
});
FormControl.displayName = "FormControl";

// ─── FormDescription ──────────────────────────────────────────────────────────

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("font-sans text-sm text-muted-foreground leading-5", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// ─── FormMessage ──────────────────────────────────────────────────────────────

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? error) : children;

  if (!body) return null;

  return (
    <p
      ref={ref}
      id={formMessageId}
      role={error ? "alert" : undefined}
      className={cn(
        "font-sans text-sm leading-5",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
