import type { Assignment } from "@/features/assignments/types";
import { parseApiDate } from "@/shared/utils/date";
import type { WeeklyPoint } from "../types";

const DAYS_IN_WEEK = 7;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Local calendar-day key, so bucketing is unaffected by daylight-saving shifts. */
function toDayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Midnight on the Monday of the week containing `reference`. */
function startOfWeek(reference: Date): Date {
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % DAYS_IN_WEEK));
  return start;
}

/**
 * When an assignment left `Draft`. The API stamps `updatedAt` on the publish
 * transition but exposes no dedicated publish timestamp, so an assignment edited
 * after publication reports the edit instead. Drafts are not counted at all.
 */
export function resolvePublishedAt(assignment: Assignment): Date | null {
  if (assignment.status === "Draft") {
    return null;
  }
  return parseApiDate(assignment.updatedAt ?? assignment.createdAt);
}

/**
 * Counts assignments published on each day of the week containing `reference`,
 * always Monday through Sunday so the axis reads consistently.
 */
export function buildWeeklySeries(
  assignments: readonly Assignment[],
  reference: Date = new Date(),
): WeeklyPoint[] {
  const weekStart = startOfWeek(reference);

  const countsByDay = new Map<string, number>();
  for (const assignment of assignments) {
    const publishedAt = resolvePublishedAt(assignment);
    if (!publishedAt) {
      continue;
    }
    const key = toDayKey(publishedAt);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  return WEEKDAY_LABELS.map((label, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    const key = toDayKey(day);

    return {
      date: key,
      label,
      fullLabel: day.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      value: countsByDay.get(key) ?? 0,
    };
  });
}
