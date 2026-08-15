import type { Assignment } from "@/features/assignments/types";
import type { Course } from "@/features/courses/types";
import type { Submission } from "@/features/submissions/types";
import { parseApiDate } from "@/shared/utils/date";

const DAY_MS = 24 * 60 * 60 * 1000;
const DUE_SOON_DAYS = 7;

/** What the student can do next with an assignment, given their own submission. */
export type StudentAction = "submit" | "continue" | "graded";

export interface StudentAssignmentRow {
  id: string;
  title: string;
  courseLabel: string;
  description: string;
  /** Whole days until the deadline; negative once it has passed, `null` if unreadable. */
  daysLeft: number | null;
  dueLabel: string;
  isUrgent: boolean;
  action: StudentAction;
}

export interface StudentStats {
  /** The schema enrols a student in at most one course, so this is 0 or 1. */
  enrolledCourseCount: number;
  upcomingCount: number;
  dueThisWeekCount: number;
  pendingGradeCount: number;
  /** Mean of graded submissions as a percentage of each assignment's max marks. */
  averageScorePercent: number | null;
}

function daysUntil(deadline: string, now: Date): number | null {
  const parsed = parseApiDate(deadline);
  if (!parsed) {
    return null;
  }
  return Math.ceil((parsed.getTime() - now.getTime()) / DAY_MS);
}

function toDueLabel(daysLeft: number | null): string {
  if (daysLeft === null) {
    return "No deadline";
  }
  if (daysLeft < 0) {
    return "Overdue";
  }
  if (daysLeft === 0) {
    return "Due today";
  }
  return `${daysLeft} Day${daysLeft === 1 ? "" : "s"} Left`;
}

function resolveAction(submission: Submission | undefined): StudentAction {
  if (!submission) {
    return "submit";
  }
  return submission.status === "Graded" ? "graded" : "continue";
}

/**
 * The assignments a student still has to act on, soonest deadline first.
 * `GET /assignments` already returns only work published to their course.
 */
export function buildStudentAssignmentRows(
  assignments: readonly Assignment[],
  submissions: readonly Submission[],
  courses: readonly Course[],
  now: Date = new Date(),
): StudentAssignmentRow[] {
  const coursesById = new Map(courses.map((course) => [course.id, course]));
  const submissionsByAssignment = new Map(
    submissions.map((submission) => [submission.assignmentId, submission]),
  );

  return assignments
    .map((assignment) => {
      const daysLeft = daysUntil(assignment.deadline, now);
      const course = coursesById.get(assignment.courseId);

      return {
        id: assignment.id,
        title: assignment.title,
        courseLabel: course?.code ?? course?.name ?? "Course",
        description: assignment.description,
        daysLeft,
        dueLabel: toDueLabel(daysLeft),
        isUrgent: daysLeft !== null && daysLeft <= 2,
        action: resolveAction(submissionsByAssignment.get(assignment.id)),
      };
    })
    .sort((left, right) => (left.daysLeft ?? Infinity) - (right.daysLeft ?? Infinity));
}

export function buildStudentStats(
  assignments: readonly Assignment[],
  submissions: readonly Submission[],
  enrolledCourse: Course | null,
  now: Date = new Date(),
): StudentStats {
  const upcoming = assignments.filter((assignment) => {
    const days = daysUntil(assignment.deadline, now);
    return days !== null && days >= 0;
  });

  const maxMarksById = new Map(assignments.map((item) => [item.id, item.maxMarks]));
  let gradedCount = 0;
  let scoreTotal = 0;

  for (const submission of submissions) {
    const maxMarks = maxMarksById.get(submission.assignmentId);
    const marks = submission.obtainedMarks;
    if (submission.status !== "Graded" || marks === null || marks === undefined) {
      continue;
    }
    if (maxMarks === undefined || maxMarks <= 0) {
      continue;
    }
    gradedCount += 1;
    scoreTotal += (marks / maxMarks) * 100;
  }

  return {
    enrolledCourseCount: enrolledCourse ? 1 : 0,
    upcomingCount: upcoming.length,
    dueThisWeekCount: upcoming.filter((assignment) => {
      const days = daysUntil(assignment.deadline, now);
      return days !== null && days <= DUE_SOON_DAYS;
    }).length,
    pendingGradeCount: submissions.filter((submission) => submission.status !== "Graded").length,
    averageScorePercent: gradedCount > 0 ? Math.round(scoreTotal / gradedCount) : null,
  };
}
