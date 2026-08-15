import { Clock } from "lucide-react";
import type { Assignment } from "@/features/assignments/types";
import type { Student } from "@/features/students/types";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge, type BadgeProps } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { formatDateTime } from "@/shared/utils/date";
import type { Submission } from "../types";
import { resolvePunctuality, resolveStudentName, toShortId } from "../utils/submission-review";

const PUNCTUALITY_BADGES: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  "on-time": { label: "On Time", variant: "success" },
  late: { label: "Late", variant: "warning" },
  unknown: { label: "Submitted", variant: "default" },
};

interface SubmissionSummaryCardProps {
  submission: Submission;
  assignment: Assignment | null;
  student: Student | null;
}

export function SubmissionSummaryCard({
  submission,
  assignment,
  student,
}: SubmissionSummaryCardProps) {
  const badge = PUNCTUALITY_BADGES[resolvePunctuality(submission, assignment)] ?? {
    label: "Submitted",
    variant: "default" as const,
  };
  const studentName = resolveStudentName(student);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-h2">{assignment?.title ?? "Submission"}</h1>
        <Badge variant={badge.variant} className="shrink-0">
          {badge.label}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-on-surface-muted">
        <span className="flex items-center gap-2">
          <Avatar name={studentName} className="h-6 w-6" />
          <span>
            <span className="font-semibold text-on-surface">Student: {studentName}</span>{" "}
            (ID: {toShortId(submission.studentId)})
          </span>
        </span>

        <span aria-hidden className="hidden h-4 w-px bg-outline-variant sm:block" />

        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden />
          Submitted: {formatDateTime(submission.createdAt)}
        </span>

        {submission.reviewedAt ? (
          <>
            <span aria-hidden className="hidden h-4 w-px bg-outline-variant sm:block" />
            <span>Graded: {formatDateTime(submission.reviewedAt)}</span>
          </>
        ) : null}
      </div>
    </Card>
  );
}
