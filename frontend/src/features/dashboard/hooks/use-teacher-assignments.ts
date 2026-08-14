"use client";

import { useMemo } from "react";
import type { AssignmentRow } from "../types";
import { buildAssignmentRows, countUpcomingDeadlines } from "../utils/teacher-assignments";
import { useAssignmentCollectionQuery, useCourseCollectionQuery } from "./use-dashboard-sources";

export interface TeacherAssignmentsResult {
  /** Draft and published assignments, soonest deadline first. */
  activeRows: AssignmentRow[];
  totalCount: number | null;
  upcomingDeadlineCount: number | null;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * The teacher's own assignments. `GET /assignments` is already scoped to the
 * caller by the API, so no client-side ownership filter is needed.
 */
export function useTeacherAssignments(): TeacherAssignmentsResult {
  const assignmentsQuery = useAssignmentCollectionQuery();
  const coursesQuery = useCourseCollectionQuery();

  const assignments = assignmentsQuery.data?.items;
  const courses = coursesQuery.data?.items;

  const activeRows = useMemo(
    () => buildAssignmentRows(assignments ?? [], courses ?? []),
    [assignments, courses],
  );

  const upcomingDeadlineCount = useMemo(
    () => (assignments ? countUpcomingDeadlines(assignments) : null),
    [assignments],
  );

  return {
    activeRows,
    totalCount: assignmentsQuery.data?.totalRecords ?? null,
    upcomingDeadlineCount,
    isLoading: assignmentsQuery.isPending || coursesQuery.isPending,
    errorMessage: assignmentsQuery.error ? assignmentsQuery.error.message : null,
  };
}
