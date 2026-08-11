import { z } from "zod";
import type { UserListItem } from "../types";

export const userListItemSchema: z.ZodType<UserListItem> = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Teacher", "Student"]),
  isActive: z.boolean(),
  lastLoginAt: z.string().nullish(),
  createdAt: z.string().optional(),
});

export const userListSchema = z.array(userListItemSchema);
