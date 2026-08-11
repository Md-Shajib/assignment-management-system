import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "outline";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-container text-on-surface-variant",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-danger/10 text-danger",
  outline: "border border-outline-variant text-on-surface-variant",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-caption font-medium",
        badgeClasses[variant],
        className,
      )}
      {...props}
    />
  );
}