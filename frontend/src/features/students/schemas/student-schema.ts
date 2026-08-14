import { z } from "zod";
import type { Student } from "../types";

export const studentSchema: z.ZodType<Student> = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  courseId: z.string().nullish(),
});

export const studentListSchema = z.array(studentSchema);
