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
