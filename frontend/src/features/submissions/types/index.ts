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
