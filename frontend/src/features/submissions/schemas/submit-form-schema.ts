import { z } from "zod";

export const SUBMISSION_TEXT_MAX = 4000;
export const ATTACHMENT_MAX = 500;

export const SUBMIT_FORM_FIELDS = ["submissionText", "attachment"] as const;

export const EMPTY_SUBMIT_FORM = {
  submissionText: "",
  attachment: "",
};

/** Mirrors `SubmitValidator`: an empty submission is rejected, and both fields are bounded. */
export const submitFormSchema = z
  .object({
    submissionText: z
      .string()
      .trim()
      .max(SUBMISSION_TEXT_MAX, `Keep your response within ${SUBMISSION_TEXT_MAX} characters.`),
    attachment: z
      .string()
      .trim()
      .max(ATTACHMENT_MAX, `Keep the link within ${ATTACHMENT_MAX} characters.`),
  })
  .superRefine((values, ctx) => {
    if (values.submissionText.length === 0 && values.attachment.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["submissionText"],
        message: "Add a response or an attachment link before submitting.",
      });
    }
  });

export type SubmitFormValues = z.infer<typeof submitFormSchema>;
