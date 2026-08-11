"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import { NAV_ITEMS, findNavItemByPath } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { APP_NAME } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

interface SidebarProps {
  variant: "full" | "rail" | "drawer";
  onClose?: () => void;
}

export function Sidebar({ variant, onClose }: SidebarProps) {
  const { role } = useAuth();
  const pathname = usePathname();
  const isRail = variant === "rail";

  const items = NAV_ITEMS.filter((item) => role === null || item.roles.includes(role));
  const activeHref = findNavItemByPath(pathname)?.href;

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-outline-variant/60 bg-surface-container-lowest",
        isRail ? "w-20 items-center" : "w-64",
      )}
    >
      <div className={cn("flex h-16 shrink-0 items-center border-b border-outline-variant/60", isRail ? "justify-center" : "gap-3 px-5")}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        {!isRail ? <span className="truncate text-body-sm font-semibold tracking-tight">{APP_NAME}</span> : null}
        {variant === "drawer" ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <nav className={cn("flex-1 overflow-y-auto py-4", isRail ? "flex flex-col items-center gap-2" : "space-y-1 px-3")}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isRail ? item.title : undefined}
              aria-label={isRail ? item.title : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md text-label transition-colors",
                isRail ? "h-10 w-10 justify-center" : "h-10 px-3",
                isActive
                  ? "bg-primary-fixed text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {!isRail ? <span className="truncate">{item.title}</span> : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}