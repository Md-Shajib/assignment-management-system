"use client";

import { useQuery } from "@tanstack/react-query";
import { assignmentService } from "@/features/assignments/services/assignment-service";
import type { Assignment } from "@/features/assignments/types";
import { studentService } from "@/features/students/services/student-service";
import type { Student } from "@/features/students/types";
import { submissionService } from "../services/submission-service";
import type { Submission } from "../types";

export const submissionQueryKeys = {
  all: ["submissions"] as const,
  detail: (submissionId: string) => [...submissionQueryKeys.all, "detail", submissionId] as const,
  assignment: (assignmentId: string) => ["assignments", "detail", assignmentId] as const,
  student: (studentId: string) => ["students", "detail", studentId] as const,
};

export interface SubmissionReviewResult {
  submission: Submission | null;
  /** Carries the title and the marks ceiling; `null` until it resolves. */
  assignment: Assignment | null;
  student: Student | null;
  isLoading: boolean;
  /** Only the submission is essential — a missing name or title degrades the page, not blocks it. */
  errorMessage: string | null;
}

/**
 * Everything the review screen needs. The assignment and student are fetched from
 * ids on the submission, so they are chained behind it rather than requested up front.
 */
export function useSubmissionReview(submissionId: string): SubmissionReviewResult {
  const submissionQuery = useQuery({
    queryKey: submissionQueryKeys.detail(submissionId),
    queryFn: () => submissionService.getById(submissionId),
  });

  const submission = submissionQuery.data?.data ?? null;

  const assignmentQuery = useQuery({
    queryKey: submissionQueryKeys.assignment(submission?.assignmentId ?? ""),
    queryFn: () => assignmentService.getById(submission?.assignmentId ?? ""),
    enabled: submission !== null,
  });

  const studentQuery = useQuery({
    queryKey: submissionQueryKeys.student(submission?.studentId ?? ""),
    queryFn: () => studentService.getById(submission?.studentId ?? ""),
    enabled: submission !== null,
  });

  return {
    submission,
    assignment: assignmentQuery.data?.data ?? null,
    student: studentQuery.data?.data ?? null,
    isLoading: submissionQuery.isPending || (submission !== null && assignmentQuery.isPending),
    errorMessage: submissionQuery.error ? submissionQuery.error.message : null,
  };
}
