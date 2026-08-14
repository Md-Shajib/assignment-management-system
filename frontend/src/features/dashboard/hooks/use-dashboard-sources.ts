"use client";

import { useQueries, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { assignmentService } from "@/features/assignments/services/assignment-service";
import type { Assignment } from "@/features/assignments/types";
import { courseService } from "@/features/courses/services/course-service";
import type { Course } from "@/features/courses/types";
import { studentService } from "@/features/students/services/student-service";
import type { Student } from "@/features/students/types";
import { submissionService } from "@/features/submissions/services/submission-service";
import type { Submission } from "@/features/submissions/types";
import { teacherService } from "@/features/teachers/services/teacher-service";
import type { Teacher } from "@/features/teachers/types";
import { userService } from "@/features/users/services/user-service";
import type { UserListItem } from "@/features/users/types";
import { fetchPagedCollection, type PagedCollection } from "@/shared/api/paged-collection";

/**
 * The API exposes no aggregate or activity endpoints (an analytics API is listed
 * as a future improvement in docs/01-PROJECT-ASSUMPTIONS.md), so the overview is
 * derived from the list endpoints. Reads are capped: totals always come from the
 * pagination envelope, while the rows behind the chart and the activity feed are
 * limited to `AGGREGATION_MAX_PAGES` pages so a large table cannot flood the browser.
 */
const AGGREGATION_MAX_PAGES = 5;

/** Lookup pools only supply display names, so a single page is enough. */
const LOOKUP_MAX_PAGES = 1;

/** Totals are read from `meta`, so the rows themselves can be left unfetched. */
const COUNT_ONLY_PAGE_SIZE = 1;

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  userCount: () => [...dashboardQueryKeys.all, "user-count"] as const,
  teachers: () => [...dashboardQueryKeys.all, "teachers"] as const,
  students: () => [...dashboardQueryKeys.all, "students"] as const,
  courses: () => [...dashboardQueryKeys.all, "courses"] as const,
  assignments: () => [...dashboardQueryKeys.all, "assignments"] as const,
  submissions: () => [...dashboardQueryKeys.all, "submissions"] as const,
  assignmentSubmissions: (assignmentId: string) =>
    [...dashboardQueryKeys.all, "submissions", assignmentId] as const,
};

export type CollectionQuery<T> = UseQueryResult<PagedCollection<T>, Error>;

/** `GET /users` is Admin-only and is read purely for its total. */
export function useUserCountQuery(): CollectionQuery<UserListItem> {
  return useQuery({
    queryKey: dashboardQueryKeys.userCount(),
    queryFn: () => fetchPagedCollection(userService.list, { pageSize: COUNT_ONLY_PAGE_SIZE }),
  });
}

export function useTeacherCollectionQuery(): CollectionQuery<Teacher> {
  return useQuery({
    queryKey: dashboardQueryKeys.teachers(),
    queryFn: () => fetchPagedCollection(teacherService.list, { maxPages: LOOKUP_MAX_PAGES }),
  });
}

export function useStudentCollectionQuery(): CollectionQuery<Student> {
  return useQuery({
    queryKey: dashboardQueryKeys.students(),
    queryFn: () => fetchPagedCollection(studentService.list, { maxPages: LOOKUP_MAX_PAGES }),
  });
}

export function useCourseCollectionQuery(): CollectionQuery<Course> {
  return useQuery({
    queryKey: dashboardQueryKeys.courses(),
    queryFn: () => fetchPagedCollection(courseService.list, { maxPages: LOOKUP_MAX_PAGES }),
  });
}

export function useAssignmentCollectionQuery(): CollectionQuery<Assignment> {
  return useQuery({
    queryKey: dashboardQueryKeys.assignments(),
    queryFn: () => fetchPagedCollection(assignmentService.list, { maxPages: AGGREGATION_MAX_PAGES }),
  });
}

export function useSubmissionCollectionQuery(): CollectionQuery<Submission> {
  return useQuery({
    queryKey: dashboardQueryKeys.submissions(),
    queryFn: () => fetchPagedCollection(submissionService.list, { maxPages: AGGREGATION_MAX_PAGES }),
  });
}

/**
 * Submissions for specific assignments, one query each.
 *
 * A teacher may not read `GET /submissions` unscoped — the API answers 403 unless
 * the request names an assignment they own — so a teacher's submission totals can
 * only be assembled assignment by assignment. Callers cap the id list.
 */
export function useAssignmentSubmissionQueries(
  assignmentIds: readonly string[],
): CollectionQuery<Submission>[] {
  return useQueries({
    queries: assignmentIds.map((assignmentId) => ({
      queryKey: dashboardQueryKeys.assignmentSubmissions(assignmentId),
      queryFn: () =>
        fetchPagedCollection(
          (request) => submissionService.list({ ...request, assignmentId }),
          { maxPages: AGGREGATION_MAX_PAGES },
        ),
    })),
  });
}
