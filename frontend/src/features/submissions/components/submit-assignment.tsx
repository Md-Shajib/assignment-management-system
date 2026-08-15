"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants";
import { useAssignmentSubmission } from "../hooks/use-assignment-submission";
import { AssignmentBriefCard } from "./assignment-brief-card";
import { SubmitAssignmentForm } from "./submit-assignment-form";

export function SubmitAssignment({ assignmentId }: { assignmentId: string }) {
  const { assignment, course, submission, isLoading, errorMessage } =
    useAssignmentSubmission(assignmentId);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card className="p-6 lg:col-span-3">
          <Skeleton className="h-96 w-full" />
        </Card>
      </div>
    );
  }

  if (errorMessage || !assignment) {
    return (
      <ErrorState
        title="This assignment could not be opened."
        description={errorMessage ?? "It may not be published to your course."}
        action={
          <Link href={ROUTES.dashboard} className="text-label text-primary hover:underline">
            Back to dashboard
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.dashboard}
          aria-label="Back to dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-surface-container-low"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
        <p className="text-body-sm font-semibold text-primary">Submit Assignment</p>
      </div>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-5">
        <AssignmentBriefCard assignment={assignment} course={course} className="lg:col-span-2" />
        <SubmitAssignmentForm
          assignment={assignment}
          submission={submission}
          className="lg:col-span-3"
        />
      </div>
    </div>
  );
}
