"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Button } from "@/shared/components/ui/button";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
