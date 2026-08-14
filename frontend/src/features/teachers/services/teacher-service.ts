import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { teacherListSchema } from "../schemas/teacher-schema";
import type { Teacher } from "../types";

export const teacherService = {
  /** `GET /teachers?page&pageSize` — any authenticated user. */
  list({ page, pageSize }: PageRequest): Promise<ApiResponse<Teacher[]>> {
    return httpClient.get("/teachers", teacherListSchema, { params: { page, pageSize } });
  },
};
