"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants";
import { useSubmissionReview } from "../hooks/use-submission-review";
import { GradingPanel } from "./grading-panel";
import { SubmissionContentCard } from "./submission-content-card";
import { SubmissionSummaryCard } from "./submission-summary-card";

function ReviewSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <Card className="p-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-4 h-4 w-1/2" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
      <Card className="p-6 lg:col-span-2">
        <Skeleton className="h-96 w-full" />
      </Card>
    </div>
  );
}

export function SubmissionReview({ submissionId }: { submissionId: string }) {
  const { submission, assignment, student, isLoading, errorMessage } =
    useSubmissionReview(submissionId);

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (errorMessage || !submission) {
    return (
      <ErrorState
        title="This submission could not be opened."
        description={errorMessage ?? "It may have been removed, or you may not have access to it."}
        action={
          <Link href={ROUTES.submissions} className="text-label text-primary hover:underline">
            Back to submissions
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-body-sm">
          <li>
            <Link href={ROUTES.submissions} className="text-on-surface-muted hover:text-on-surface">
              Submissions
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 shrink-0 text-on-surface-subtle" aria-hidden />
          <li aria-current="page" className="truncate font-semibold text-on-surface">
            Review: {assignment?.title ?? "Submission"}
          </li>
        </ol>
      </nav>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <SubmissionSummaryCard submission={submission} assignment={assignment} student={student} />
          <SubmissionContentCard submission={submission} />
        </div>

        <GradingPanel
          submission={submission}
          assignment={assignment}
          className="lg:sticky lg:top-20 lg:col-span-2"
        />
      </div>
    </div>
  );
}
