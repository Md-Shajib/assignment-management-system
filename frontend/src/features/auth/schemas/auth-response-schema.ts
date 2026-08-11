import { z } from "zod";
import type { LoginResponse } from "../types";

const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Teacher", "Student"]),
  fullName: z.string().optional(),
});

/** Validates the `data` payload of `POST /auth/login` (docs/04-API-DESIGN.md §8.1). */
export const loginResponseSchema: z.ZodType<LoginResponse> = z.object({
  accessToken: z.string().min(1),
  expiresIn: z.number(),
  user: authUserSchema.optional(),
});
