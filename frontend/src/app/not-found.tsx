import Link from "next/link";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { ROUTES } from "@/shared/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ErrorState
        title="Page not found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <Link href={ROUTES.dashboard} className="text-label text-primary hover:underline">
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
