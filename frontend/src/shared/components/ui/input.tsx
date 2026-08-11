import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type InputVariant = "outline" | "underline";

const variantClasses: Record<InputVariant, string> = {
  outline:
    "h-10 rounded-md border bg-surface-container-lowest px-3 text-body-sm focus:ring-2",
  underline: "h-9 rounded-none border-0 border-b bg-transparent px-0 text-body",
};

const stateClasses: Record<InputVariant, { valid: string; invalid: string }> = {
  outline: {
    valid: "border-outline-variant focus:border-primary focus:ring-primary/25",
    invalid: "border-error focus:border-error focus:ring-error/25",
  },
  underline: {
    valid: "border-divider focus:border-primary",
    invalid: "border-error focus:border-error",
  },
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  variant?: InputVariant;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, variant = "outline", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full text-on-surface transition-colors placeholder:text-on-surface-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        invalid ? stateClasses[variant].invalid : stateClasses[variant].valid,
        className,
      )}
      {...props}
    />
  );
});
