import { httpClient } from "@/shared/api/http-client";
import type { PageRequest } from "@/shared/api/paged-collection";
import type { ApiResponse } from "@/shared/types/api";
import { courseSchema } from "@/features/courses/schemas/course-schema";
import type { Course } from "@/features/courses/types";
import { studentListSchema, studentSchema } from "../schemas/student-schema";
import type { Student } from "../types";

export const studentService = {
  /** `GET /students?page&pageSize` — any authenticated user. */
  list({ page, pageSize }: PageRequest): Promise<ApiResponse<Student[]>> {
    return httpClient.get("/students", studentListSchema, { params: { page, pageSize } });
  },

  /** `GET /students/{id}` — any authenticated user. */
  getById(studentId: string): Promise<ApiResponse<Student>> {
    return httpClient.get(`/students/${studentId}`, studentSchema);
  },

  /** `GET /students/{id}/course` — the enrolled course, or `null` when not enrolled. */
  getEnrolledCourse(studentId: string): Promise<ApiResponse<Course | null>> {
    return httpClient.get(`/students/${studentId}/course`, courseSchema.nullable());
  },
};
