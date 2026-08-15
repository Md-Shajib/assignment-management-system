"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { courseService } from "@/features/courses/services/course-service";
import type { Course } from "@/features/courses/types";
import { MAX_PAGE_SIZE, USER_ROLES } from "@/shared/constants";

export interface AssignableCoursesResult {
  courses: Course[];
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * Courses the signed-in user may create an assignment for.
 *
 * A teacher is restricted to the courses they are assigned to — the API answers
 * 403 for any other course — while an admin may pick any course.
 */
export function useAssignableCourses(): AssignableCoursesResult {
  const { user, role } = useAuth();
  const teacherId = role === USER_ROLES.TEACHER ? user?.id : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["assignable-courses", teacherId ?? "all"],
    queryFn: () =>
      teacherId === undefined
        ? courseService.list({ page: 1, pageSize: MAX_PAGE_SIZE })
        : courseService.listByTeacher(teacherId),
    // An admin needs no teacher id; a teacher cannot be resolved until auth settles.
    enabled: role !== null && (role !== USER_ROLES.TEACHER || teacherId !== undefined),
  });

  return {
    courses: data?.data ?? [],
    isLoading,
    errorMessage: error ? error.message : null,
  };
}
