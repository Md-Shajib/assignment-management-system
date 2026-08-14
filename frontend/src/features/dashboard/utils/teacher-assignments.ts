import type { Assignment, AssignmentStatus } from "@/features/assignments/types";
import type { Course } from "@/features/courses/types";
import { parseApiDate } from "@/shared/utils/date";
import type { AssignmentRow } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_WINDOW_DAYS = 7;

/** An assignment is "active" while it can still change: drafts and published work. */
const ACTIVE_STATUSES: readonly AssignmentStatus[] = ["Draft", "Published"];

function endOfDay(reference: Date): Date {
  return new Date(reference.getFullYear(), reference.getMonth(), reference.getDate(), 23, 59, 59, 999);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function toDueLabel(deadline: Date | null, now: Date): string {
  if (!deadline) {
    return "—";
  }
  if (isSameDay(deadline, now)) {
    return `Today, ${deadline.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  }
  return deadline.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Joins assignments to their course so a row can show the class it belongs to.
 * Courses beyond the lookup pool fall back to a neutral label rather than an id.
 */
export function buildAssignmentRows(
  assignments: readonly Assignment[],
  courses: readonly Course[],
  now: Date = new Date(),
): AssignmentRow[] {
  const coursesById = new Map(courses.map((course) => [course.id, course]));
  const todayEnd = endOfDay(now);

  return assignments
    .filter((assignment) => ACTIVE_STATUSES.includes(assignment.status))
    .map((assignment) => {
      const course = coursesById.get(assignment.courseId);
      const deadline = parseApiDate(assignment.deadline);

      return {
        id: assignment.id,
        title: assignment.title,
        courseName: course?.name ?? "Unassigned class",
        courseCode: course?.code ?? null,
        status: assignment.status,
        dueLabel: toDueLabel(deadline, now),
        dueTimestamp: deadline?.getTime() ?? null,
        isDueSoon: deadline !== null && deadline.getTime() <= todayEnd.getTime(),
      };
    })
    .sort((left, right) => (left.dueTimestamp ?? Infinity) - (right.dueTimestamp ?? Infinity));
}

/**
 * Published assignments whose deadline falls inside the next seven days —
 * the work a teacher still has to collect.
 */
export function countUpcomingDeadlines(
  assignments: readonly Assignment[],
  now: Date = new Date(),
): number {
  const windowEnd = now.getTime() + UPCOMING_WINDOW_DAYS * DAY_MS;

  return assignments.filter((assignment) => {
    if (assignment.status !== "Published") {
      return false;
    }
    const deadline = parseApiDate(assignment.deadline);
    return deadline !== null && deadline.getTime() >= now.getTime() && deadline.getTime() <= windowEnd;
  }).length;
}
