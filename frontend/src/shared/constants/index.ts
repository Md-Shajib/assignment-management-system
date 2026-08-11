export const APP_NAME = "Assignment Management System";

export const STORAGE_KEYS = {
  accessToken: "ams.access-token",
} as const;

export const ROUTES = {
  login: "/login",
  dashboard: "/",
  courses: "/courses",
  teachers: "/teachers",
  students: "/students",
  assignments: "/assignments",
  submissions: "/submissions",
} as const;

export const USER_ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
} as const;