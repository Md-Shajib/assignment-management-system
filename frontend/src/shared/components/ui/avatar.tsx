import { cn } from "@/shared/utils/cn";

interface AvatarProps {
  name: string;
  className?: string;
}

/** Derives up to two initials from a display name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-caption font-semibold text-on-primary",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
