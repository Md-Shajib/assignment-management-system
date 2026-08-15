import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-md border bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface transition-colors placeholder:text-on-surface-subtle focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-error focus:border-error focus:ring-error/25"
          : "border-outline-variant focus:border-primary focus:ring-primary/25",
        className,
      )}
      {...props}
    />
  );
});
