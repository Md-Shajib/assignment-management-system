"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Avatar } from "@/shared/components/ui/avatar";
import { useDismissable } from "@/shared/hooks/use-dismissable";

export function ProfileMenu() {
  const { user, role, logout } = useAuth();
  const { containerRef, isOpen, close, toggle } = useDismissable();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-md px-2 py-1 text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
      >
        <span className="hidden sm:inline">Profile</span>
        <Avatar name={user?.fullName ?? user?.email ?? "?"} className="h-8 w-8" />
        <ChevronDown className="h-4 w-4 text-on-surface-muted sm:hidden" aria-hidden />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-md border border-border-muted bg-surface-container-lowest shadow-modal"
        >
          <div className="border-b border-border-muted px-4 py-3">
            <p className="truncate text-body-sm font-semibold text-on-surface">
              {user?.fullName ?? user?.email ?? "Signed in"}
            </p>
            <p className="truncate text-caption text-on-surface-muted">{role}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
