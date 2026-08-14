import { z } from "zod";
import { ASSIGNMENT_STATUSES } from "../types";
import type { Assignment } from "../types";

export const assignmentSchema: z.ZodType<Assignment> = z.object({
  id: z.string(),
  courseId: z.string(),
  teacherId: z.string(),
  title: z.string(),
  description: z.string(),
  maxMarks: z.number(),
  deadline: z.string(),
  lateSubmissionEndDate: z.string().nullish(),
  status: z.enum(ASSIGNMENT_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
});

export const assignmentListSchema = z.array(assignmentSchema);
