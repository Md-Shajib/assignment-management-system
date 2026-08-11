"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/shared/constants";

export default function AuthLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isAuthenticated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">{children}</div>
  );
}