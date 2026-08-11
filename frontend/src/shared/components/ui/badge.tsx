import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "admin"
  | "teacher"
  | "student";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-container text-on-surface-variant",
  primary: "bg-primary/10 text-primary",
  success: "bg-success-container text-success",
  warning: "bg-warning-container text-warning",
  error: "bg-danger-container text-on-danger-container",
  outline: "border border-outline-variant text-on-surface-variant",
  admin: "bg-role-admin-container text-role-admin",
  teacher: "bg-role-teacher-container text-role-teacher",
  student: "bg-role-student-container text-role-student",
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
