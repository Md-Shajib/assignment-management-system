export type UserRole = "Admin" | "Teacher" | "Student";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user?: AuthUser;
}