import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ActiveAssignmentsCard } from "./active-assignments-card";
import { QuickActionsCard } from "./quick-actions-card";
import { StatTiles } from "./stat-tiles";

export function TeacherOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1">Overview</h1>
          <p className="mt-1 text-body-sm text-on-surface-muted">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* No assignment-authoring screen exists yet; `POST /assignments` is API-only. */}
        <Button disabled title="Creating assignments is not available yet">
          <Plus className="h-4 w-4" aria-hidden />
          Create Assignment
        </Button>
      </div>

      <StatTiles />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ActiveAssignmentsCard className="lg:col-span-2" />
        <QuickActionsCard />
      </div>
    </div>
  );
}
