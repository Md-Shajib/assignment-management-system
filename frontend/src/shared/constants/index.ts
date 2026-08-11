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
  submissions: "/submissions",
  settings: "/settings",
} as const;

export const USER_ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
