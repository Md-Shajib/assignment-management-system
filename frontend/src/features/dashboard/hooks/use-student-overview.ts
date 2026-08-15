"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { studentService } from "@/features/students/services/student-service";
import { submissionService } from "@/features/submissions/services/submission-service";
import {
  buildStudentAssignmentRows,
  buildStudentStats,
  type StudentAssignmentRow,
  type StudentStats,
} from "../utils/student-overview";
import {
  dashboardQueryKeys,
  useAssignmentCollectionQuery,
  useCourseCollectionQuery,
} from "./use-dashboard-sources";

export interface StudentOverviewResult {
  rows: StudentAssignmentRow[];
  stats: StudentStats;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * The student's own view. `GET /assignments` is already narrowed by the API to
 * work published to their enrolled course, and `GET /submissions/my` to their own
 * submissions, so no client-side ownership filtering is needed.
 */
export function useStudentOverview(): StudentOverviewResult {
  const { user } = useAuth();
  const studentId = user?.id;

  const assignmentsQuery = useAssignmentCollectionQuery();
  const coursesQuery = useCourseCollectionQuery();

  const submissionsQuery = useQuery({
    queryKey: [...dashboardQueryKeys.all, "my-submissions"],
    queryFn: () => submissionService.listMine(),
  });

  const enrolledCourseQuery = useQuery({
    queryKey: [...dashboardQueryKeys.all, "enrolled-course", studentId ?? ""],
    queryFn: () => studentService.getEnrolledCourse(studentId ?? ""),
    enabled: studentId !== undefined,
  });

  const assignments = assignmentsQuery.data?.items;
  const courses = coursesQuery.data?.items;
  const submissions = submissionsQuery.data?.data;
  const enrolledCourse = enrolledCourseQuery.data?.data ?? null;

  const rows = useMemo(
    () => buildStudentAssignmentRows(assignments ?? [], submissions ?? [], courses ?? []),
    [assignments, submissions, courses],
  );

  const stats = useMemo(
    () => buildStudentStats(assignments ?? [], submissions ?? [], enrolledCourse),
    [assignments, submissions, enrolledCourse],
  );

  const error = assignmentsQuery.error ?? submissionsQuery.error;

  return {
    rows,
    stats,
    isLoading: assignmentsQuery.isPending || submissionsQuery.isPending,
    errorMessage: error ? error.message : null,
  };
}
