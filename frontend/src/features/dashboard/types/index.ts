import type { LucideIcon } from "lucide-react";

/** A headline number on the overview, rendered as a stat tile. */
export interface DashboardMetric {
  key: string;
  label: string;
  icon: LucideIcon;
  /** `null` while loading, or when the source endpoint could not be read. */
  value: number | null;
  isLoading: boolean;
  errorMessage: string | null;
}

/** One bar of the weekly assignments chart. */
export interface WeeklyPoint {
  /** Local calendar day the bucket covers, as `YYYY-MM-DD`. */
  date: string;
  /** Short axis label, e.g. "Mon". */
  label: string;
  /** Full label used by assistive technology and the tooltip. */
  fullLabel: string;
  value: number;
}

export const ACTIVITY_KINDS = [
  "assignment-published",
  "assignment-drafted",
  "assignment-closed",
  "submission-received",
  "submission-graded",
  "course-created",
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

/**
 * A slice of an activity sentence. Emphasized segments carry the entities the
 * reader scans for (people, courses, assignments) and are rendered in bold.
 */
export interface ActivitySegment {
  text: string;
  emphasis?: boolean;
}

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  segments: ActivitySegment[];
  occurredAt: string;
}
