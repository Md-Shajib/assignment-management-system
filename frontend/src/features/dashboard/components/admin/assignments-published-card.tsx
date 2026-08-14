"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, MoreVertical, RefreshCw } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDismissable } from "@/shared/hooks/use-dismissable";
import { ROUTES } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";
import { useAssignmentsPublished } from "../../hooks/use-assignments-published";
import { dashboardQueryKeys } from "../../hooks/use-dashboard-sources";
import { WeeklyBarChart } from "../weekly-bar-chart";

const MENU_ITEM_CLASSES =
  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low";

function ChartMenu() {
  const { containerRef, isOpen, close, toggle } = useDismissable();
  const queryClient = useQueryClient();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Chart options"
        className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-surface-container-low"
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-md border border-border-muted bg-surface-container-lowest shadow-modal"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.assignments() });
            }}
            className={MENU_ITEM_CLASSES}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Refresh chart
          </button>
          <Link href={ROUTES.assignments} role="menuitem" onClick={close} className={MENU_ITEM_CLASSES}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            View assignments
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function AssignmentsPublishedCard({ className }: { className?: string }) {
  const { points, isLoading, errorMessage, isComplete } = useAssignmentsPublished();

  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-h3 tracking-tight">Assignments Published</h2>
          <p className="mt-1 text-body-sm text-on-surface-muted">This week, Monday to Sunday.</p>
        </div>
        <ChartMenu />
      </div>

      {/* Leaves room for the tooltip above a full-height column. */}
      <div className="mt-8">
        {isLoading ? <Skeleton className="h-64 w-full" /> : null}

        {!isLoading && errorMessage ? (
          <div className="flex h-64 flex-col items-center justify-center gap-1 text-center">
            <p className="text-body-sm font-semibold text-on-surface">The chart could not be loaded.</p>
            <p className="text-body-sm text-on-surface-muted">{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage ? <WeeklyBarChart points={points} unitLabel="published" /> : null}
      </div>

      {!isComplete ? (
        <p className="mt-4 text-caption text-on-surface-subtle">
          Counted from the assignments this page reads; older records beyond that limit are not included.
        </p>
      ) : null}
    </Card>
  );
}
