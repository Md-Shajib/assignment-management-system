"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { USER_ROLES } from "@/shared/constants";
import { AdminOverview } from "./admin/admin-overview";
import { StudentOverview } from "./student/student-overview";
import { TeacherOverview } from "./teacher/teacher-overview";

/** Derives the greeting name, preferring the first name the way the design reads. */
function toGreetingName(fullName: string | undefined, email: string | undefined): string {
  const first = fullName?.trim().split(/\s+/)[0];
  return first || email || "there";
}

export function DashboardOverview() {
  const { user, role } = useAuth();

  if (role === USER_ROLES.ADMIN) {
    return <AdminOverview />;
  }

  if (role === USER_ROLES.TEACHER) {
    return <TeacherOverview />;
  }

  return <StudentOverview name={toGreetingName(user?.fullName, user?.email)} />;
}
