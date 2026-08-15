export const SUBMISSION_STATUSES = ["Submitted", "LateSubmitted", "Graded"] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

/** A row of `GET /submissions` (docs/04-API-DESIGN.md §8.7). */
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string | null;
  attachment?: string | null;
  status: SubmissionStatus;
  obtainedMarks?: number | null;
  teacherFeedback?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Body of `PATCH /submissions/{id}/review`. The awarded marks must be between 0
 * and the assignment's maximum; the upper bound is enforced by the API.
 */
export interface GradeSubmissionRequest {
  obtainedMarks: number;
  teacherFeedback?: string;
}
