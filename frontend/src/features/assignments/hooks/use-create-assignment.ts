"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { assignmentService } from "../services/assignment-service";
import type { Assignment, CreateAssignmentRequest } from "../types";

/** Whether the draft the API creates should immediately be published. */
export type SubmitIntent = "draft" | "publish";

export interface CreateAssignmentInput {
  request: CreateAssignmentRequest;
  intent: SubmitIntent;
}

export interface CreateAssignmentResult {
  assignment: Assignment;
  /**
   * Set when the assignment was created but the publish step failed — the draft
   * exists, so this is a partial success and must not read as a total failure.
   */
  publishErrorMessage: string | null;
}

export function useCreateAssignment(): UseMutationResult<
  CreateAssignmentResult,
  Error,
  CreateAssignmentInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, intent }: CreateAssignmentInput) => {
      // `POST /assignments` always creates a draft; publishing is a second call.
      const created = await assignmentService.create(request);

      if (intent === "draft") {
        return { assignment: created.data, publishErrorMessage: null };
      }

      try {
        const published = await assignmentService.publish(created.data.id);
        return { assignment: published.data, publishErrorMessage: null };
      } catch (error) {
        return {
          assignment: created.data,
          publishErrorMessage:
            error instanceof Error ? error.message : "The assignment could not be published.",
        };
      }
    },
    onSuccess: () => {
      // A new assignment shifts counts, charts, and lists across the app; the
      // dashboard owns those caches, so everything is refreshed rather than
      // reaching into another feature's query keys.
      void queryClient.invalidateQueries();
    },
  });
}
