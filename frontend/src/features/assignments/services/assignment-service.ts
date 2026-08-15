import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { assignmentListSchema, assignmentSchema } from "../schemas/assignment-schema";
import type { Assignment, CreateAssignmentRequest } from "../types";

export interface AssignmentListParams extends PageRequest {
  courseId?: string;
}

export const assignmentService = {
  /** `GET /assignments?courseId&page&pageSize` — scoped to the caller's role by the API. */
  list({ page, pageSize, courseId }: AssignmentListParams): Promise<ApiResponse<Assignment[]>> {
    return httpClient.get("/assignments", assignmentListSchema, {
      params: { page, pageSize, courseId },
    });
  },

  /** `GET /assignments/{id}` — the owning teacher, an admin, or a student it is published to. */
  getById(assignmentId: string): Promise<ApiResponse<Assignment>> {
    return httpClient.get(`/assignments/${assignmentId}`, assignmentSchema);
  },

  /** `POST /assignments` — Admin or the teacher assigned to the course. Creates a draft. */
  create(request: CreateAssignmentRequest): Promise<ApiResponse<Assignment>> {
    return httpClient.post("/assignments", assignmentSchema, request);
  },

  /** `PATCH /assignments/{id}/publish` — Draft → Published; the deadline must still be ahead. */
  publish(assignmentId: string): Promise<ApiResponse<Assignment>> {
    return httpClient.patch(`/assignments/${assignmentId}/publish`, assignmentSchema);
  },
};
