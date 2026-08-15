import type { Assignment } from "@/features/assignments/types";
import type { Student } from "@/features/students/types";
import { parseApiDate } from "@/shared/utils/date";
import type { Submission } from "../types";

export type Punctuality = "on-time" | "late" | "unknown";

/**
 * Whether the work arrived before the deadline.
 *
 * The stored status is not enough on its own: grading overwrites `Submitted` and
 * `LateSubmitted` with `Graded`, so punctuality is recomputed from the timestamps,
 * which stay true for the life of the record.
 */
export function resolvePunctuality(
  submission: Submission,
  assignment: Assignment | null,
): Punctuality {
  if (!assignment) {
    return submission.status === "LateSubmitted" ? "late" : "unknown";
  }

  const submittedAt = parseApiDate(submission.createdAt);
  const deadline = parseApiDate(assignment.deadline);
  if (!submittedAt || !deadline) {
    return "unknown";
  }
  return submittedAt.getTime() <= deadline.getTime() ? "on-time" : "late";
}

/** Short, human-quotable form of an id, since the API identifies students by UUID. */
export function toShortId(id: string): string {
  return id.split("-")[0]?.toUpperCase() ?? id;
}

export function resolveStudentName(student: Student | null): string {
  return student?.fullName ?? "Unknown student";
}

/**
 * An attachment is stored as a URL or a path. Only an absolute http(s) URL can be
 * opened, so a bare path is reported as unavailable rather than linked to nothing.
 */
export function resolveAttachmentUrl(attachment: string | null | undefined): string | null {
  if (!attachment) {
    return null;
  }
  try {
    const url = new URL(attachment);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
