"use client";

import { CalendarClock, ClipboardList, FileText, Target } from "lucide-react";
import { useTeacherAssignments } from "../../hooks/use-teacher-assignments";
import { useTeacherSubmissions } from "../../hooks/use-teacher-submissions";
import { StatTile, type StatTone } from "./stat-tile";

/** Score bands drive the meter color, so the bar reads as a verdict, not decoration. */
function scoreTone(percent: number): StatTone {
  if (percent >= 80) {
    return "primary";
  }
  return percent >= 50 ? "warning" : "danger";
}

export function StatTiles() {
  const assignments = useTeacherAssignments();
  const submissions = useTeacherSubmissions();

  const averageScore = submissions.averageScorePercent;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={FileText}
        tone="primary"
        label="Total Assignments"
        value={assignments.totalCount === null ? null : assignments.totalCount.toLocaleString()}
        isLoading={assignments.isLoading}
        errorMessage={assignments.errorMessage}
      />

      <StatTile
        icon={ClipboardList}
        tone="danger"
        label="Pending Submissions"
        value={submissions.errorMessage ? null : submissions.pendingCount.toLocaleString()}
        isLoading={submissions.isLoading}
        errorMessage={submissions.errorMessage}
        badge={submissions.pendingCount > 0 ? { text: "Needs Review", variant: "warning" } : undefined}
      />

      <StatTile
        icon={Target}
        tone="warning"
        label="Average Score"
        value={averageScore === null ? null : `${averageScore}%`}
        isLoading={submissions.isLoading}
        errorMessage={submissions.errorMessage}
        meterPercent={averageScore}
        meterTone={averageScore === null ? "neutral" : scoreTone(averageScore)}
      />

      <StatTile
        icon={CalendarClock}
        tone="neutral"
        label="Upcoming Deadlines"
        value={
          assignments.upcomingDeadlineCount === null
            ? null
            : assignments.upcomingDeadlineCount.toLocaleString()
        }
        isLoading={assignments.isLoading}
        errorMessage={assignments.errorMessage}
        badge={{ text: "This Week", variant: "default" }}
      />
    </div>
  );
}
