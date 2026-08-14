import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { courseListSchema } from "../schemas/course-schema";
import type { Course } from "../types";

export const courseService = {
  /** `GET /courses?page&pageSize` — any authenticated user; soft-deleted rows excluded. */
  list({ page, pageSize }: PageRequest): Promise<ApiResponse<Course[]>> {
    return httpClient.get("/courses", courseListSchema, { params: { page, pageSize } });
  },
};
