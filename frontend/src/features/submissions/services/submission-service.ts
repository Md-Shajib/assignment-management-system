import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { submissionListSchema } from "../schemas/submission-schema";
import type { Submission } from "../types";

export interface SubmissionListParams extends PageRequest {
  assignmentId?: string;
}

export const submissionService = {
  /**
   * `GET /submissions?assignmentId&page&pageSize`. Admins may omit `assignmentId`
   * to read every submission; teachers must scope the request to their own assignment.
   */
  list({ page, pageSize, assignmentId }: SubmissionListParams): Promise<ApiResponse<Submission[]>> {
    return httpClient.get("/submissions", submissionListSchema, {
      params: { page, pageSize, assignmentId },
    });
  },
};
