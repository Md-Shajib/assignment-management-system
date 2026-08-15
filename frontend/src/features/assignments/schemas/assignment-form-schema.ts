import { z } from "zod";

const TITLE_MAX_LENGTH = 200;

/** Reads a `datetime-local` value ("2026-08-20T23:59") as a local instant. */
function toInstant(value: string): number | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Mirrors `CreateAssignmentValidator` on the server so the same rules are enforced
 * before a request is sent. Every field stays a string here because that is what
 * the inputs produce; the payload is built from the parsed values.
 */
export const assignmentFormSchema = z
  .object({
    courseId: z.string().min(1, "Select the class this assignment belongs to."),
    title: z
      .string()
      .trim()
      .min(1, "Enter an assignment title.")
      .max(TITLE_MAX_LENGTH, `Keep the title within ${TITLE_MAX_LENGTH} characters.`),
    description: z.string().trim().min(1, "Describe what students need to do."),
    maxMarks: z.string().trim().min(1, "Enter the maximum marks."),
    deadline: z.string().min(1, "Choose a deadline."),
    allowLateSubmissions: z.boolean(),
    lateSubmissionEndDate: z.string(),
  })
  .superRefine((values, ctx) => {
    // A blank field already reported "required"; a second issue would only repeat it.
    if (values.maxMarks.length > 0) {
      const marks = Number(values.maxMarks);
      if (!Number.isFinite(marks) || marks <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["maxMarks"],
          message: "Maximum marks must be greater than 0.",
        });
      }
    }

    if (values.deadline.length === 0) {
      return;
    }

    const deadline = toInstant(values.deadline);
    if (deadline === null) {
      ctx.addIssue({ code: "custom", path: ["deadline"], message: "Choose a valid deadline." });
      return;
    }
    if (deadline <= Date.now()) {
      ctx.addIssue({ code: "custom", path: ["deadline"], message: "The deadline must be in the future." });
    }

    if (!values.allowLateSubmissions) {
      return;
    }

    const lateEnd = toInstant(values.lateSubmissionEndDate);
    if (lateEnd === null) {
      ctx.addIssue({
        code: "custom",
        path: ["lateSubmissionEndDate"],
        message: "Choose when late submissions close.",
      });
      return;
    }
    if (lateEnd <= deadline) {
      ctx.addIssue({
        code: "custom",
        path: ["lateSubmissionEndDate"],
        message: "Late submissions must close after the deadline.",
      });
    }
  });

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export const ASSIGNMENT_FORM_FIELDS = [
  "courseId",
  "title",
  "description",
  "maxMarks",
  "deadline",
  "lateSubmissionEndDate",
] as const;

export const EMPTY_ASSIGNMENT_FORM: AssignmentFormValues = {
  courseId: "",
  title: "",
  description: "",
  maxMarks: "",
  deadline: "",
  allowLateSubmissions: false,
  lateSubmissionEndDate: "",
};
