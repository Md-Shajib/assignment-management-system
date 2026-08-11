"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { USER_ROLES } from "@/shared/constants";

export default function DashboardPage() {
  const { user, role } = useAuth();
  const roleLabel =
    role === USER_ROLES.STUDENT ? "student" : role === USER_ROLES.TEACHER ? "teacher" : "administrator";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Dashboard</h1>
        <p className="mt-1 text-body-sm text-on-surface-muted">
          Welcome back, {user?.fullName ?? user?.email}. Here is your overview as a {roleLabel}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-h3 text-on-surface-variant">—</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-on-surface-muted">Summary cards will appear here soon.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}