import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-md border bg-surface-container-lowest px-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-error focus:border-error focus:ring-error/25"
          : "border-outline-variant focus:border-primary focus:ring-primary/25",
        className,
      )}
      {...props}
    />
  );
});