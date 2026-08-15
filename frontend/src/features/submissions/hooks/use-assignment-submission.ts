"use client";

import { useMutation, useQuery, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { assignmentService } from "@/features/assignments/services/assignment-service";
import type { Assignment } from "@/features/assignments/types";
import { courseService } from "@/features/courses/services/course-service";
import type { Course } from "@/features/courses/types";
import { MAX_PAGE_SIZE } from "@/shared/constants";
import { submissionService } from "../services/submission-service";
import type { Submission, SubmitRequest } from "../types";

const mySubmissionsKey = ["submissions", "mine"] as const;

export interface AssignmentSubmissionResult {
  assignment: Assignment | null;
  course: Course | null;
  /** The student's existing submission for this assignment, if they already sent one. */
  submission: Submission | null;
  isLoading: boolean;
  errorMessage: string | null;
}

/** The assignment being answered plus the student's own submission for it. */
export function useAssignmentSubmission(assignmentId: string): AssignmentSubmissionResult {
  const assignmentQuery = useQuery({
    queryKey: ["assignments", "detail", assignmentId],
    queryFn: () => assignmentService.getById(assignmentId),
  });

  const submissionsQuery = useQuery({
    queryKey: mySubmissionsKey,
    queryFn: () => submissionService.listMine(),
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", "list", MAX_PAGE_SIZE],
    queryFn: () => courseService.list({ page: 1, pageSize: MAX_PAGE_SIZE }),
  });

  const assignment = assignmentQuery.data?.data ?? null;

  return {
    assignment,
    course: coursesQuery.data?.data.find((item) => item.id === assignment?.courseId) ?? null,
    submission:
      submissionsQuery.data?.data.find((item) => item.assignmentId === assignmentId) ?? null,
    isLoading: assignmentQuery.isPending || submissionsQuery.isPending,
    errorMessage: assignmentQuery.error ? assignmentQuery.error.message : null,
  };
}

export interface SubmitAssignmentInput {
  request: SubmitRequest;
  /** Present when the student is revising an existing submission. */
  submissionId: string | null;
}

export function useSubmitAssignment(): UseMutationResult<Submission, Error, SubmitAssignmentInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, submissionId }: SubmitAssignmentInput) => {
      const response = submissionId
        ? await submissionService.update(submissionId, request)
        : await submissionService.create(request);
      return response.data;
    },
    onSuccess: () => {
      // Submitting changes the student's pending counts and the teacher's queue.
      void queryClient.invalidateQueries();
    },
  });
}
