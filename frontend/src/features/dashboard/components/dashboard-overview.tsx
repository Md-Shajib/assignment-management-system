"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Card } from "@/shared/components/ui/card";
import { USER_ROLES } from "@/shared/constants";
import { AdminOverview } from "./admin/admin-overview";
import { TeacherOverview } from "./teacher/teacher-overview";

/**
 * Students reach the same route, but the overview widgets built so far read
 * sources the API scopes away from them. They get a greeting until a student
 * dashboard exists.
 */
function StudentOverview({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Overview</h1>
        <p className="mt-1 text-body-sm text-on-surface-muted">
          Welcome back, {name}. Here is your workspace as a student.
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

  if (role === USER_ROLES.TEACHER) {
    return <TeacherOverview />;
  }

  return <StudentOverview name={user?.fullName ?? user?.email ?? "there"} />;
}
