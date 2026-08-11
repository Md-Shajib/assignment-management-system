"use client";

import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { findNavItemByPath } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const title = findNavItemByPath(pathname)?.title ?? "Dashboard";

  const name = user?.fullName ?? user?.email ?? "User";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-outline-variant/60 bg-surface-container-lowest/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-h3">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-label text-on-primary-container">
            {initials}
          </span>
          <div className="hidden sm:block">
            <p className="text-label text-on-surface">{name}</p>
            <p className="text-caption text-on-surface-variant">{role}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}