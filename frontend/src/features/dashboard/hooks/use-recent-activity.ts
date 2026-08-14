"use client";

import { useMemo } from "react";
import type { ActivityItem } from "../types";
import { buildActivityFeed } from "../utils/activity-feed";
import {
  useAssignmentCollectionQuery,
  useCourseCollectionQuery,
  useStudentCollectionQuery,
  useSubmissionCollectionQuery,
  useTeacherCollectionQuery,
} from "./use-dashboard-sources";

export interface RecentActivityResult {
  items: ActivityItem[];
  isLoading: boolean;
  errorMessage: string | null;
}

/** Most recent entries kept in memory; the card decides how many to show. */
const ACTIVITY_LIMIT = 20;

/**
 * Recent activity, merged from the timestamps on assignments, submissions, and
 * courses. Only the two event sources are required — missing teacher, student, or
 * course names degrade the wording rather than emptying the feed.
 */
export function useRecentActivity(): RecentActivityResult {
  const assignments = useAssignmentCollectionQuery();
  const submissions = useSubmissionCollectionQuery();
  const courses = useCourseCollectionQuery();
  const teachers = useTeacherCollectionQuery();
  const students = useStudentCollectionQuery();

  const assignmentItems = assignments.data?.items;
  const submissionItems = submissions.data?.items;
  const courseItems = courses.data?.items;
  const teacherItems = teachers.data?.items;
  const studentItems = students.data?.items;

  const items = useMemo(
    () =>
      buildActivityFeed(
        {
          assignments: assignmentItems ?? [],
          submissions: submissionItems ?? [],
          courses: courseItems ?? [],
          teachers: teacherItems ?? [],
          students: studentItems ?? [],
        },
        ACTIVITY_LIMIT,
      ),
    [assignmentItems, submissionItems, courseItems, teacherItems, studentItems],
  );

  const eventSourceError = assignments.error ?? submissions.error ?? courses.error;

  return {
    items,
    isLoading: assignments.isPending || submissions.isPending || courses.isPending,
    errorMessage: eventSourceError ? eventSourceError.message : null,
  };
}
