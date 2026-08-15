export const ASSIGNMENT_STATUSES = ["Draft", "Published", "Closed"] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

/**
 * A row of `GET /assignments` (docs/04-API-DESIGN.md §8.6).
 *
 * The API records no dedicated publish timestamp; `updatedAt` is stamped when an
 * assignment transitions out of `Draft`, so it is the closest available proxy.
 */
export interface Assignment {
  id: string;
  courseId: string;
  teacherId: string;
  title: string;
  description: string;
  maxMarks: number;
  deadline: string;
  lateSubmissionEndDate?: string | null;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Body of `POST /assignments`. The API always creates in `Draft`; publishing is a
 * separate transition, so the status is not part of the payload.
 */
export interface CreateAssignmentRequest {
  courseId: string;
  title: string;
  description: string;
  maxMarks: number;
  /** ISO-8601 UTC instant. */
  deadline: string;
  /** ISO-8601 UTC instant; omitted when late submissions are not accepted. */
  lateSubmissionEndDate?: string;
}
