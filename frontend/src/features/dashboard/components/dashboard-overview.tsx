"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Card } from "@/shared/components/ui/card";
import { USER_ROLES } from "@/shared/constants";
import { AssignmentsPublishedCard } from "./assignments-published-card";
import { RecentActivityCard } from "./recent-activity-card";
import { StatCards } from "./stat-cards";

function AdminOverview() {
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

/**
 * Teachers and students reach the same route, but every source the admin overview
 * reads is either Admin-only or scoped away from them by the API. They get a
 * greeting until their own dashboards are built.
 */
function RoleOverview({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Overview</h1>
        <p className="mt-1 text-body-sm text-on-surface-muted">
          Welcome back, {name}. Here is your workspace as a {roleLabel}.
        </p>
      </div>

      <Card className="p-6">
        <p className="text-body-sm text-on-surface-muted">
          Your dashboard is not available yet. Use the navigation to reach your assignments and
          submissions.
        </p>
      </Card>
    </div>
  );
}

export function DashboardOverview() {
  const { user, role } = useAuth();

  if (role === USER_ROLES.ADMIN) {
    return <AdminOverview />;
  }

  return (
    <RoleOverview
      name={user?.fullName ?? user?.email ?? "there"}
      roleLabel={role === USER_ROLES.TEACHER ? "teacher" : "student"}
    />
  );
}
