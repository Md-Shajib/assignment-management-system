import { AssignmentsPublishedCard } from "./assignments-published-card";
import { RecentActivityCard } from "./recent-activity-card";
import { StatCards } from "./stat-cards";

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Overview</h1>
        <p className="mt-1 text-body-sm text-on-surface-muted">
          Here&apos;s a summary of your institution&apos;s metrics.
        </p>
      </div>

      <StatCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <AssignmentsPublishedCard className="lg:col-span-2" />
        <RecentActivityCard />
      </div>
    </div>
  );
}
