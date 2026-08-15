export const APP_NAME = "Assignment Management System";

export const STORAGE_KEYS = {
  accessToken: "ams.access-token",
} as const;

export const ROUTES = {
  login: "/login",
  dashboard: "/",
  users: "/users",
  classes: "/classes",
  subjects: "/subjects",
  assignments: "/assignments",
  assignmentCreate: "/assignments/new",
  submissions: "/submissions",
  settings: "/settings",
} as const;

/** Nested routes that need an id, kept beside `ROUTES` so paths stay in one place. */
export function assignmentSubmitRoute(assignmentId: string): string {
  return `${ROUTES.assignments}/${assignmentId}/submit`;
}

export function submissionReviewRoute(submissionId: string): string {
  return `${ROUTES.submissions}/${submissionId}`;
}

export const USER_ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
} as const;

export const DEFAULT_PAGE_SIZE = 10;

/** Upper bound the API clamps `pageSize` to (backend `PaginationQuery.MaxPageSize`). */
export const MAX_PAGE_SIZE = 100;
