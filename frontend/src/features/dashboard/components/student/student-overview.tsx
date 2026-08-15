"use client";

import { BookOpen, CalendarClock, CircleCheck, Clock, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { useStudentOverview } from "../../hooks/use-student-overview";
import type { StudentAction, StudentAssignmentRow } from "../../utils/student-overview";

/** Submitting work needs a submission screen, which does not exist yet. */
const SUBMIT_UNAVAILABLE = "Submitting work from the browser is not available yet";

const ACTION_LABELS: Record<StudentAction, string> = {
  submit: "Submit Work",
  continue: "Continue Draft",
  graded: "Graded",
};

interface StatTileProps {
  icon: typeof BookOpen;
  label: string;
  value: string;
  note: string;
  noteIcon: typeof Clock;
  isLoading: boolean;
  highlight?: boolean;
}

function StatTile({
  icon: Icon,
  label,
  value,
  note,
  noteIcon: NoteIcon,
  isLoading,
  highlight = false,
}: StatTileProps) {
  return (
    <Card className={cn("p-5", highlight && "border-primary bg-primary text-on-primary")}>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", highlight ? "text-on-primary/80" : "text-on-surface-muted")} aria-hidden />
        <span className={cn("text-caption", highlight ? "text-on-primary/80" : "text-on-surface-muted")}>
          {label}
        </span>
      </div>

      {isLoading ? (
        <Skeleton className="mt-3 h-8 w-16" />
      ) : (
        <p className={cn("mt-2 text-h1", highlight ? "text-on-primary" : "text-on-surface")}>{value}</p>
      )}

      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-caption",
          highlight ? "text-on-primary/80" : "text-on-surface-muted",
        )}
      >
        <NoteIcon className="h-3.5 w-3.5" aria-hidden />
        {note}
      </p>
    </Card>
  );
}

function AssignmentRow({ row }: { row: StudentAssignmentRow }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-4 border-b border-border-muted p-5 last:border-0">
      <div className="flex min-w-0 gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-on-surface-variant"
        >
          <FileText className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="font-semibold text-on-surface">{row.title}</p>
          <p className="mt-0.5 line-clamp-2 text-body-sm text-on-surface-muted">
            <span className="text-primary">{row.courseLabel}</span> • {row.description}
          </p>
          <Badge variant={row.isUrgent ? "error" : "default"} className="mt-2 gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {row.dueLabel}
          </Badge>
        </div>
      </div>

      <button
        type="button"
        disabled
        title={row.action === "graded" ? "This submission has been graded" : SUBMIT_UNAVAILABLE}
        className={cn(
          "shrink-0 rounded-md px-4 py-2 text-label disabled:cursor-not-allowed disabled:opacity-60",
          row.action === "submit"
            ? "bg-primary text-on-primary"
            : "border border-outline-variant text-on-surface",
        )}
      >
        {ACTION_LABELS[row.action]}
      </button>
    </li>
  );
}

export function StudentOverview({ name }: { name: string }) {
  const { rows, stats, isLoading, errorMessage } = useStudentOverview();

  return (
    <div className="space-y-6">
      <h1 className="text-h2">Welcome back, {name}</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={BookOpen}
          label="Enrolled Course"
          value={stats.enrolledCourseCount.toString()}
          note={stats.enrolledCourseCount > 0 ? "Active" : "Not enrolled yet"}
          noteIcon={CircleCheck}
          isLoading={isLoading}
        />
        <StatTile
          icon={CalendarClock}
          label="Upcoming Assignments"
          value={stats.upcomingCount.toString()}
          note={`${stats.dueThisWeekCount} due this week`}
          noteIcon={Clock}
          isLoading={isLoading}
        />
        <StatTile
          icon={Clock}
          label="Pending Grades"
          value={stats.pendingGradeCount.toString()}
          note="Awaiting review"
          noteIcon={Clock}
          isLoading={isLoading}
        />
        {/*
          The design shows a GPA. Nothing in the schema records grade points or
          term history, so this reports the mean of graded submissions instead,
          and carries no "since last term" delta.
        */}
        <StatTile
          icon={TrendingUp}
          label="Average Score"
          value={stats.averageScorePercent === null ? "—" : `${stats.averageScorePercent}%`}
          note={stats.averageScorePercent === null ? "Nothing graded yet" : "Across graded work"}
          noteIcon={CircleCheck}
          isLoading={isLoading}
          highlight
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between gap-4 p-5 pb-4">
            <h2 className="text-h3 tracking-tight">Published Assignments</h2>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5 pt-0">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : errorMessage ? (
            <div className="p-5 pt-0">
              <p className="text-body-sm font-semibold text-on-surface">
                Assignments could not be loaded.
              </p>
              <p className="text-body-sm text-on-surface-muted">{errorMessage}</p>
            </div>
          ) : rows.length === 0 ? (
            <p className="p-5 pt-0 text-body-sm text-on-surface-muted">
              Nothing published for your course yet.
            </p>
          ) : (
            <ul className="border-t border-border-muted">
              {rows.map((row) => (
                <AssignmentRow key={row.id} row={row} />
              ))}
            </ul>
          )}
        </Card>

        {/*
          The design pairs this with a timetable and a study-room promo. The API
          has no schedule, room, or facility data of any kind, so the panel says
          so rather than displaying invented classes.
        */}
        <Card className="p-5">
          <h2 className="text-h3 tracking-tight">Today&apos;s Schedule</h2>
          <p className="mt-2 text-body-sm text-on-surface-muted">
            Class times are not available yet — the API records no timetable.
          </p>
        </Card>
      </div>
    </div>
  );
}
