import type { UserRole } from "@/features/auth/types";

/**
 * A row of `GET /users` (docs/04-API-DESIGN.md §8.2).
 *
 * `lastLoginAt` has no column in the current schema (docs/03-DATABSE-DESIGN.md §5),
 * so it is optional and renders as "Never" until the backend tracks it.
 */
export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export type UserStatus = "Active" | "Inactive";

export interface UserListParams {
  page: number;
  pageSize: number;
}
