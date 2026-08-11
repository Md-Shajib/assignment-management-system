import { forwardRef, type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export type SearchFieldProps = InputHTMLAttributes<HTMLInputElement>;

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { className, ...props },
  ref,
) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-subtle"
        aria-hidden
      />
      <input
        ref={ref}
        type="search"
        className="h-9 w-full rounded-md border border-border bg-surface-container-lowest pl-9 pr-3 text-body-sm text-on-surface transition-colors placeholder:text-on-surface-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
        {...props}
      />
    </div>
  );
});
