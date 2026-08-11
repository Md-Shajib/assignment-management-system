import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types";
import { ROUTES } from "@/shared/constants";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

/** Single source of truth for navigation and route-level role access. */
export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard, roles: ["Admin", "Teacher", "Student"] },
  { title: "Courses", href: ROUTES.courses, icon: BookOpen, roles: ["Admin", "Teacher", "Student"] },
  { title: "Teachers", href: ROUTES.teachers, icon: Users, roles: ["Admin"] },
  { title: "Students", href: ROUTES.students, icon: GraduationCap, roles: ["Admin"] },
  { title: "Assignments", href: ROUTES.assignments, icon: FileText, roles: ["Admin", "Teacher", "Student"] },
  { title: "Submissions", href: ROUTES.submissions, icon: ClipboardList, roles: ["Admin", "Teacher", "Student"] },
];

/** Resolves the nav section owning a path, including its nested routes. */
export function findNavItemByPath(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) =>
    item.href === ROUTES.dashboard
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

/** Routes outside the nav config are open to any authenticated user. */
export function canAccessPath(pathname: string, role: UserRole): boolean {
  const item = findNavItemByPath(pathname);
  return item === undefined || item.roles.includes(role);
}
