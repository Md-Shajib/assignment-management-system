import type { Submission } from "@/features/submissions/types";

export interface AssignmentSubmissions {
  /** Marks the assignment is out of, used to normalize scores across assignments. */
  maxMarks: number;
  submissions: readonly Submission[];
}

export interface SubmissionStats {
  /** Handed in but not yet graded. */
  pendingCount: number;
  gradedCount: number;
  /** Mean score as a percentage of each assignment's max marks; `null` when nothing is graded. */
  averageScorePercent: number | null;
}

const PENDING_STATUSES = new Set(["Submitted", "LateSubmitted"]);

/**
 * Aggregates a teacher's submissions across assignments.
 *
 * Scores are normalized per assignment before averaging — a 20/25 and a 90/100
 * weigh the same — because assignments carry different maximum marks.
 */
export function summarizeSubmissions(entries: readonly AssignmentSubmissions[]): SubmissionStats {
  let pendingCount = 0;
  let gradedCount = 0;
  let scoreTotal = 0;

  for (const { maxMarks, submissions } of entries) {
    for (const submission of submissions) {
      if (PENDING_STATUSES.has(submission.status)) {
        pendingCount += 1;
        continue;
      }

      const marks = submission.obtainedMarks;
      if (submission.status !== "Graded" || marks === null || marks === undefined || maxMarks <= 0) {
        continue;
      }

      gradedCount += 1;
      scoreTotal += (marks / maxMarks) * 100;
    }
  }

  return {
    pendingCount,
    gradedCount,
    averageScorePercent: gradedCount > 0 ? Math.round(scoreTotal / gradedCount) : null,
  };
}
