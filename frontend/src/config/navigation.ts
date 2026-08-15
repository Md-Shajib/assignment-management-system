import {
  LayoutDashboard,
  Users,
  BookOpen,
  Library,
  FileText,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types";
import { ROUTES } from "@/shared/constants";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  /** Breadcrumb trail shown in the topbar; defaults to `[title]`. */
  breadcrumb?: readonly string[];
}

const ALL_ROLES: UserRole[] = ["Admin", "Teacher", "Student"];

/** Single source of truth for navigation and route-level role access. */
export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard, roles: ALL_ROLES },
  {
    title: "Users",
    href: ROUTES.users,
    icon: Users,
    roles: ["Admin"],
    breadcrumb: ["Users", "Management"],
  },
  { title: "Classes", href: ROUTES.classes, icon: BookOpen, roles: ALL_ROLES },
  { title: "Subjects", href: ROUTES.subjects, icon: Library, roles: ALL_ROLES },
  { title: "Assignments", href: ROUTES.assignments, icon: FileText, roles: ALL_ROLES },
  { title: "Submissions", href: ROUTES.submissions, icon: ClipboardList, roles: ALL_ROLES },
];

/** Pinned to the bottom of the sidebar, separate from the main sections. */
export const SETTINGS_NAV_ITEM: NavItem = {
  title: "Settings",
  href: ROUTES.settings,
  icon: Settings,
  roles: ALL_ROLES,
};

const ALL_NAV_ITEMS: NavItem[] = [...NAV_ITEMS, SETTINGS_NAV_ITEM];

interface RouteRoleOverride {
  path: string;
  roles: UserRole[];
  /** Matches the path itself and everything nested under it. */
  includeNested?: boolean;
}

/**
 * Routes that are reached from inside a section rather than the sidebar, and so
 * need their own role gate — they would otherwise inherit their parent's access.
 */
const ROUTE_ROLE_OVERRIDES: readonly RouteRoleOverride[] = [
  // `POST /assignments` is Admin/Teacher only (docs/04-API-DESIGN.md §8.6).
  { path: ROUTES.assignmentCreate, roles: ["Admin", "Teacher"] },
  // Reviewing a submission calls `PATCH /submissions/{id}/review`, Admin/Teacher only.
  { path: ROUTES.submissions, roles: ["Admin", "Teacher"], includeNested: true },
];

function findRoleOverride(pathname: string): RouteRoleOverride | undefined {
  return ROUTE_ROLE_OVERRIDES.find((entry) =>
    entry.includeNested ? pathname.startsWith(`${entry.path}/`) : entry.path === pathname,
  );
}

/** Resolves the nav section owning a path, including its nested routes. */
export function findNavItemByPath(pathname: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) =>
    item.href === ROUTES.dashboard
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

/** Routes outside the nav config are open to any authenticated user. */
export function canAccessPath(pathname: string, role: UserRole): boolean {
  const override = findRoleOverride(pathname);
  if (override) {
    return override.roles.includes(role);
  }

  const item = findNavItemByPath(pathname);
  return item === undefined || item.roles.includes(role);
}

export function getBreadcrumb(pathname: string): readonly string[] {
  const item = findNavItemByPath(pathname);
  if (!item) {
    return [];
  }
  return item.breadcrumb ?? [item.title];
}
