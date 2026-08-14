import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { assignmentListSchema } from "../schemas/assignment-schema";
import type { Assignment } from "../types";

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
};
