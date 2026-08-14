"use client";

import { useMemo } from "react";
import type { Assignment } from "@/features/assignments/types";
import { parseApiDate } from "@/shared/utils/date";
import { summarizeSubmissions, type SubmissionStats } from "../utils/submission-stats";
import {
  useAssignmentCollectionQuery,
  useAssignmentSubmissionQueries,
} from "./use-dashboard-sources";

/**
 * Every assignment costs one request, so only the most recent published work is
 * inspected. Older assignments contribute nothing a teacher still has to act on.
 */
const INSPECTED_ASSIGNMENT_LIMIT = 25;

export interface TeacherSubmissionsResult extends SubmissionStats {
  isLoading: boolean;
  errorMessage: string | null;
  /** `false` when the assignment limit left some submissions uncounted. */
  isComplete: boolean;
}

/** Assignments that can hold submissions, newest deadline first. */
function selectInspectedAssignments(assignments: readonly Assignment[]): Assignment[] {
  return assignments
    .filter((assignment) => assignment.status !== "Draft")
    .map((assignment) => ({
      assignment,
      deadline: parseApiDate(assignment.deadline)?.getTime() ?? 0,
    }))
    .sort((left, right) => right.deadline - left.deadline)
    .slice(0, INSPECTED_ASSIGNMENT_LIMIT)
    .map((entry) => entry.assignment);
}

export function useTeacherSubmissions(): TeacherSubmissionsResult {
  const assignmentsQuery = useAssignmentCollectionQuery();
  const assignmentItems = assignmentsQuery.data?.items;

  const inspected = useMemo(
    () => selectInspectedAssignments(assignmentItems ?? []),
    [assignmentItems],
  );

  const submissionQueries = useAssignmentSubmissionQueries(inspected.map((item) => item.id));

  // Summing at most a few hundred submissions is cheaper than tracking a
  // variable-length dependency list across renders.
  const stats = summarizeSubmissions(
    inspected.map((assignment, index) => ({
      maxMarks: assignment.maxMarks,
      submissions: submissionQueries[index]?.data?.items ?? [],
    })),
  );

  const failed = submissionQueries.find((query) => query.error);
  const truncated = (assignmentItems?.length ?? 0) > inspected.length;

  return {
    ...stats,
    isLoading: assignmentsQuery.isPending || submissionQueries.some((query) => query.isPending),
    errorMessage: assignmentsQuery.error?.message ?? failed?.error?.message ?? null,
    isComplete:
      !truncated &&
      (assignmentsQuery.data?.isComplete ?? true) &&
      submissionQueries.every((query) => query.data?.isComplete ?? true),
  };
}
