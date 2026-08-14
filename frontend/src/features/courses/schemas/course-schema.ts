import { z } from "zod";
import type { Course } from "../types";

export const courseSchema: z.ZodType<Course> = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullish(),
  teacherId: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
});

export const courseListSchema = z.array(courseSchema);
