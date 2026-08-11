import type { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-label text-on-surface-variant", className)} {...props} />;
}