"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { submissionService } from "../services/submission-service";
import type { GradeSubmissionRequest, Submission } from "../types";

export interface ReviewSubmissionInput {
  submissionId: string;
  request: GradeSubmissionRequest;
}

export function useReviewSubmission(): UseMutationResult<Submission, Error, ReviewSubmissionInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionId, request }: ReviewSubmissionInput) => {
      const response = await submissionService.review(submissionId, request);
      return response.data;
    },
    onSuccess: () => {
      // Grading moves the pending and average figures the dashboard derives, so
      // every cache is refreshed rather than reaching into another feature's keys.
      void queryClient.invalidateQueries();
    },
  });
}
