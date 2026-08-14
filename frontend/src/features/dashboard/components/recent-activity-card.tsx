"use client";

import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { useRecentActivity } from "../hooks/use-recent-activity";
import { ActivityRow } from "./activity-row";

const COLLAPSED_COUNT = 5;

function ActivitySkeleton() {
  return (
    <li className="flex gap-3">
      <Skeleton className="h-9 w-9 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </li>
  );
}

/**
 * There is no activity or audit endpoint, so this feed is assembled from the
 * timestamps on assignments, submissions, and courses. "View All" expands the
 * list in place — the events exist only here, so there is no page to link to.
 */
export function RecentActivityCard({ className }: { className?: string }) {
  const { items, isLoading, errorMessage } = useRecentActivity();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? items : items.slice(0, COLLAPSED_COUNT);
  const canExpand = items.length > COLLAPSED_COUNT;

  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-h3 tracking-tight">Recent Activity</h2>

        {canExpand ? (
          <button
            type="button"
            onClick={() => setIsExpanded((previous) => !previous)}
            aria-expanded={isExpanded}
            className="rounded-sm text-label text-primary transition-colors hover:text-primary-container"
          >
            {isExpanded ? "Show Less" : "View All"}
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <ul className="mt-5 space-y-5">
          {[0, 1, 2, 3].map((index) => (
            <ActivitySkeleton key={index} />
          ))}
        </ul>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="mt-6 space-y-1">
          <p className="text-body-sm font-semibold text-on-surface">Activity could not be loaded.</p>
          <p className="text-body-sm text-on-surface-muted">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <p className="mt-6 text-body-sm text-on-surface-muted">No activity recorded yet.</p>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <ul className={cn("mt-5 space-y-5", isExpanded && "max-h-96 overflow-y-auto pr-1")}>
          {visibleItems.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
