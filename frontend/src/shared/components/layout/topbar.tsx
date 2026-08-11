"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { getBreadcrumb } from "@/config/navigation";
import { ProfileMenu } from "./profile-menu";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border-muted bg-background px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-body-sm">
          {breadcrumb.map((crumb, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <Fragment key={crumb}>
                {index > 0 ? (
                  <ChevronRight className="h-4 w-4 shrink-0 text-on-surface-subtle" aria-hidden />
                ) : null}
                <li
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "truncate font-semibold text-on-surface" : "truncate text-on-surface-muted"}
                >
                  {crumb}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        {/* No notifications endpoint exists yet. */}
        <button
          type="button"
          disabled
          title="Notifications are not available yet"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Bell className="h-5 w-5" aria-hidden />
        </button>

        <ProfileMenu />
      </div>
    </header>
  );
}
