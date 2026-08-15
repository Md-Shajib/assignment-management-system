import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { submissionListSchema, submissionSchema } from "../schemas/submission-schema";
import type { GradeSubmissionRequest, Submission } from "../types";

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

  /** `GET /submissions/my` — the signed-in student's own submissions. */
  listMine(): Promise<ApiResponse<Submission[]>> {
    return httpClient.get("/submissions/my", submissionListSchema);
  },

  /** `GET /submissions/{id}` — Admin, the owning teacher, or the student who submitted. */
  getById(submissionId: string): Promise<ApiResponse<Submission>> {
    return httpClient.get(`/submissions/${submissionId}`, submissionSchema);
  },

  /** `PATCH /submissions/{id}/review` — Admin or the owning teacher. Re-grading is allowed. */
  review(submissionId: string, request: GradeSubmissionRequest): Promise<ApiResponse<Submission>> {
    return httpClient.patch(`/submissions/${submissionId}/review`, submissionSchema, request);
  },
};
