"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, X } from "lucide-react";
import { NAV_ITEMS, SETTINGS_NAV_ITEM, findNavItemByPath, type NavItem } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { APP_NAME } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

interface SidebarProps {
  variant: "full" | "rail" | "drawer";
  onClose?: () => void;
}

interface SidebarLinkProps {
  item: NavItem;
  isActive: boolean;
  isRail: boolean;
}

function SidebarLink({ item, isActive, isRail }: SidebarLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={isRail ? item.title : undefined}
      aria-label={isRail ? item.title : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-md text-body-sm transition-colors",
        isRail ? "h-10 w-10 justify-center" : "h-10 px-3",
        isActive
          ? "bg-secondary-container font-semibold text-primary"
          : "text-secondary hover:bg-surface-container-low hover:text-on-surface",
      )}
    >
      {isActive ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-sm bg-primary",
            isRail ? "-left-2" : "-left-3",
          )}
        />
      ) : null}
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {!isRail ? <span className="truncate">{item.title}</span> : null}
    </Link>
  );
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
        "flex h-full flex-col border-r border-border-muted bg-surface-container-lowest",
        isRail ? "w-20 items-center" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border-muted",
          isRail ? "justify-center" : "gap-3 px-5",
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
          <GraduationCap className="h-5 w-5" aria-hidden />
        </span>
        {!isRail ? (
          <span className="truncate text-body-sm font-bold leading-tight text-brand">{APP_NAME}</span>
        ) : null}
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

      <nav
        className={cn(
          "flex-1 overflow-y-auto py-4",
          isRail ? "flex flex-col items-center gap-2" : "space-y-1 px-3",
        )}
      >
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} isActive={activeHref === item.href} isRail={isRail} />
        ))}
      </nav>

      <div className={cn("shrink-0 border-t border-border-muted py-4", isRail ? "px-2" : "px-3")}>
        <SidebarLink
          item={SETTINGS_NAV_ITEM}
          isActive={activeHref === SETTINGS_NAV_ITEM.href}
          isRail={isRail}
        />
      </div>
    </div>
  );
}
