import { z } from "zod";
import type { Teacher } from "../types";

export const teacherSchema: z.ZodType<Teacher> = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
});

export const teacherListSchema = z.array(teacherSchema);
