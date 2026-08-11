"use client";

import { useEffect, type PropsWithChildren } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessPath } from "@/config/navigation";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/shared/constants";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || role === null) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex gap-6">
          <Skeleton className="hidden h-screen w-64 shrink-0 lg:block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Hiding a nav entry is not access control: guard the route itself.
  if (!canAccessPath(pathname, role)) {
    return (
      <AppShell>
        <ErrorState
          title="Access denied"
          description="You do not have permission to view this page."
        />
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
