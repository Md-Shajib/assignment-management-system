"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Button } from "@/shared/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState
        title="This page could not be loaded"
        description="An unexpected error occurred while loading this section."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
