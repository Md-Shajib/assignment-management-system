import type { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-caption text-on-surface-subtle", className)} {...props} />;
}
