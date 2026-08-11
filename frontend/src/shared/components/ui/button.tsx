import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container focus-visible:ring-primary/30",
  secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 focus-visible:ring-secondary/30",
  outline: "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container focus-visible:ring-outline/30",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container focus-visible:ring-outline/30",
  danger: "bg-error text-on-error hover:bg-error/90 focus-visible:ring-error/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-label",
  md: "h-10 px-4 text-label",
  lg: "h-12 px-6 text-body",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="absolute h-4 w-4 animate-spin" aria-hidden /> : null}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>{children}</span>
    </button>
  );
});