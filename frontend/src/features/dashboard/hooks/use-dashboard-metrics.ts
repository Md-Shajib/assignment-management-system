"use client";

import { BookOpen, GraduationCap, UserRound, Users } from "lucide-react";
import type { PagedCollection } from "@/shared/api/paged-collection";
import type { UseQueryResult } from "@tanstack/react-query";
import type { DashboardMetric } from "../types";
import {
  useCourseCollectionQuery,
  useStudentCollectionQuery,
  useTeacherCollectionQuery,
  useUserCountQuery,
} from "./use-dashboard-sources";

function toMetric<T>(
  key: string,
  label: string,
  icon: DashboardMetric["icon"],
  query: UseQueryResult<PagedCollection<T>, Error>,
): DashboardMetric {
  return {
    key,
    label,
    icon,
    value: query.data?.totalRecords ?? null,
    isLoading: query.isPending,
    errorMessage: query.error ? query.error.message : null,
  };
}

/**
 * The four headline totals. Each is read from its own endpoint, so one failing
 * source (for example the Admin-only user list) leaves the other tiles intact.
 */
export function useDashboardMetrics(): DashboardMetric[] {
  const users = useUserCountQuery();
  const teachers = useTeacherCollectionQuery();
  const students = useStudentCollectionQuery();
  const courses = useCourseCollectionQuery();

  return [
    toMetric("users", "Total Users", Users, users),
    toMetric("teachers", "Total Teachers", UserRound, teachers),
    toMetric("students", "Total Students", GraduationCap, students),
    toMetric("courses", "Active Courses", BookOpen, courses),
  ];
}
