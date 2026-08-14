import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { studentListSchema } from "../schemas/student-schema";
import type { Student } from "../types";

export const studentService = {
  /** `GET /students?page&pageSize` — any authenticated user. */
  list({ page, pageSize }: PageRequest): Promise<ApiResponse<Student[]>> {
    return httpClient.get("/students", studentListSchema, { params: { page, pageSize } });
  },
};
