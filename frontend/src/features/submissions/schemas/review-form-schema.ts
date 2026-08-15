import { z } from "zod";

export interface ReviewFormValues {
  obtainedMarks: string;
  teacherFeedback: string;
}

export const REVIEW_FORM_FIELDS = ["obtainedMarks", "teacherFeedback"] as const;

export const EMPTY_REVIEW_FORM: ReviewFormValues = {
  obtainedMarks: "",
  teacherFeedback: "",
};

/**
 * Mirrors the server's grading rules: marks are required, non-negative, and no
 * greater than the assignment's maximum. The ceiling is a parameter because it
 * belongs to the assignment, which is only known once it has been fetched — the
 * API enforces it too and answers 409 when it is exceeded.
 *
 * The return type is left inferred on purpose: widening it to `ZodType` erases the
 * schema's input type, which the React Hook Form resolver needs to stay typed.
 */
export function createReviewFormSchema(maxMarks: number | null) {
  return z
    .object({
      obtainedMarks: z.string().trim().min(1, "Enter the marks awarded."),
      teacherFeedback: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.obtainedMarks.length === 0) {
        return;
      }

      const marks = Number(values.obtainedMarks);
      if (!Number.isFinite(marks)) {
        ctx.addIssue({
          code: "custom",
          path: ["obtainedMarks"],
          message: "Marks must be a number.",
        });
        return;
      }
      if (marks < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["obtainedMarks"],
          message: "Marks cannot be negative.",
        });
        return;
      }
      if (maxMarks !== null && marks > maxMarks) {
        ctx.addIssue({
          code: "custom",
          path: ["obtainedMarks"],
          message: `Marks cannot exceed the maximum of ${maxMarks}.`,
        });
      }
    });
}
