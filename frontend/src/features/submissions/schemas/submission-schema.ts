import { z } from "zod";
import { SUBMISSION_STATUSES } from "../types";
import type { Submission } from "../types";

export const submissionSchema: z.ZodType<Submission> = z.object({
  id: z.string(),
  assignmentId: z.string(),
  studentId: z.string(),
  submissionText: z.string().nullish(),
  attachment: z.string().nullish(),
  status: z.enum(SUBMISSION_STATUSES),
  obtainedMarks: z.number().nullish(),
  teacherFeedback: z.string().nullish(),
  reviewedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
});

export const submissionListSchema = z.array(submissionSchema);
