import { CalendarDays, FileText, Info } from "lucide-react";
import type { Assignment } from "@/features/assignments/types";
import type { Course } from "@/features/courses/types";
import { Card } from "@/shared/components/ui/card";
import { formatDateTime } from "@/shared/utils/date";

interface BriefRowProps {
  icon: typeof Info;
  label: string;
  value: string;
}

function BriefRow({ icon: Icon, label, value }: BriefRowProps) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-muted" aria-hidden />
      <div>
        <p className="text-body-sm font-semibold text-on-surface">{label}</p>
        <p className="text-caption text-on-surface-muted">{value}</p>
      </div>
    </div>
  );
}

export function AssignmentBriefCard({
  assignment,
  course,
  className,
}: {
  assignment: Assignment;
  course: Course | null;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="space-y-4 p-6">
        <p className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wide text-primary">
          <FileText className="h-4 w-4" aria-hidden />
          {course?.code ?? course?.name ?? "Course"}
        </p>

        <h1 className="text-h2">{assignment.title}</h1>

        <div className="space-y-3">
          <BriefRow icon={CalendarDays} label="Due Date" value={formatDateTime(assignment.deadline)} />
          {/* The schema records no grade weighting, so this is the raw mark total. */}
          <BriefRow icon={Info} label="Points" value={`${assignment.maxMarks} points`} />
          {assignment.lateSubmissionEndDate ? (
            <BriefRow
              icon={CalendarDays}
              label="Late submissions until"
              value={formatDateTime(assignment.lateSubmissionEndDate)}
            />
          ) : null}
        </div>

        <div className="border-t border-border-muted pt-4">
          <p className="text-body-sm font-semibold text-on-surface">Instructions</p>
          <p className="mt-1 whitespace-pre-wrap text-body-sm text-on-surface-muted">
            {assignment.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
