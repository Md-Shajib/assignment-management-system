"use client";

import { useMemo } from "react";
import type { WeeklyPoint } from "../types";
import { buildWeeklySeries } from "../utils/weekly-series";
import { useAssignmentCollectionQuery } from "./use-dashboard-sources";

export interface AssignmentsPublishedResult {
  points: WeeklyPoint[];
  isLoading: boolean;
  errorMessage: string | null;
  /** `false` when the page cap truncated the assignments the counts were derived from. */
  isComplete: boolean;
}

/** Weekly publication counts for the current Monday–Sunday week. */
export function useAssignmentsPublished(): AssignmentsPublishedResult {
  const { data, isPending, error } = useAssignmentCollectionQuery();
  const assignments = data?.items;

  const points = useMemo(() => buildWeeklySeries(assignments ?? []), [assignments]);

  return {
    points,
    isLoading: isPending,
    errorMessage: error ? error.message : null,
    isComplete: data?.isComplete ?? true,
  };
}
