import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Styles the wrapper that positions the chevron — use it to widen the control. */
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, containerClassName, children, ...props },
  ref,
) {
  return (
    <div className={cn("relative inline-flex", containerClassName)}>
      <select
        ref={ref}
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-border bg-surface-container-lowest pl-3 pr-9 text-body-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted"
        aria-hidden
      />
    </div>
  );
});
