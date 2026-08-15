"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import type { Assignment } from "@/features/assignments/types";
import { ApiError } from "@/shared/api/api-error";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { MarkdownEditor } from "@/shared/components/ui/markdown-editor";
import { applyFieldErrors } from "@/shared/utils/form";
import { useSubmitAssignment } from "../hooks/use-assignment-submission";
import {
  ATTACHMENT_MAX,
  EMPTY_SUBMIT_FORM,
  SUBMIT_FORM_FIELDS,
  submitFormSchema,
  type SubmitFormValues,
} from "../schemas/submit-form-schema";
import type { Submission } from "../types";

/** There is no upload endpoint: `attachment` is a URL or path, capped at 500 characters. */
const UPLOAD_UNAVAILABLE = "File upload is not supported by the API yet — paste a link instead";

interface SubmitAssignmentFormProps {
  assignment: Assignment;
  submission: Submission | null;
  className?: string;
}

export function SubmitAssignmentForm({
  assignment,
  submission,
  className,
}: SubmitAssignmentFormProps) {
  const submitAssignment = useSubmitAssignment();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const values = useMemo<SubmitFormValues>(
    () => ({
      submissionText: submission?.submissionText ?? "",
      attachment: submission?.attachment ?? "",
    }),
    [submission?.submissionText, submission?.attachment],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SubmitFormValues>({
    resolver: zodResolver(submitFormSchema),
    defaultValues: EMPTY_SUBMIT_FORM,
    values,
  });

  const onSubmit = async (formValues: SubmitFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await submitAssignment.mutateAsync({
        submissionId: submission?.id ?? null,
        request: {
          assignmentId: assignment.id,
          submissionText: formValues.submissionText || undefined,
          attachment: formValues.attachment || undefined,
        },
      });
      setSuccessMessage(
        submission
          ? "Your submission was updated."
          : "Your work was submitted. You can revise it while the window is open.",
      );
    } catch (error) {
      if (error instanceof ApiError) {
        const unmatched = applyFieldErrors<SubmitFormValues>(
          error.fieldErrors,
          SUBMIT_FORM_FIELDS,
          setError,
        );
        setServerError([error.message, ...unmatched.map((item) => item.message)].join(" "));
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 p-6">
        {successMessage ? (
          <p role="status" className="rounded-md bg-success-container px-3 py-2 text-body-sm text-success">
            {successMessage}
          </p>
        ) : null}

        {serverError ? (
          <p
            role="alert"
            className="rounded-md bg-danger-container px-3 py-2 text-body-sm text-on-danger-container"
          >
            {serverError}
          </p>
        ) : null}

        <div>
          <Label htmlFor="submissionText" className="text-label text-on-surface">
            Your Response{" "}
            <span className="font-normal text-primary">(Optional if you attach a link)</span>
          </Label>

          <div className="mt-1.5">
            <Controller
              control={control}
              name="submissionText"
              render={({ field }) => (
                <MarkdownEditor
                  id="submissionText"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fieldRef={field.ref}
                  invalid={Boolean(errors.submissionText)}
                  describedBy={errors.submissionText ? "submissionText-error" : undefined}
                  placeholder="Type your response here..."
                />
              )}
            />
          </div>

          {errors.submissionText ? (
            <p id="submissionText-error" className="mt-1 text-caption text-error">
              {errors.submissionText.message}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-label text-on-surface">Attachments</p>

          {/*
            The design drops files here. The API stores `attachment` as a URL or
            path and exposes no upload endpoint, so the drop zone explains that
            and the link field below is what actually reaches the server.
          */}
          <div
            aria-disabled
            title={UPLOAD_UNAVAILABLE}
            className="mt-1.5 flex flex-col items-center gap-1 rounded-md border border-dashed border-outline-variant px-4 py-8 text-center opacity-70"
          >
            <UploadCloud className="h-6 w-6 text-on-surface-subtle" aria-hidden />
            <p className="text-body-sm font-semibold text-on-surface-muted">
              File uploads are not available yet
            </p>
            <p className="text-caption text-on-surface-subtle">
              Host your file and paste the link below.
            </p>
          </div>

          <div className="mt-3">
            <Label htmlFor="attachment" className="text-caption text-on-surface-muted">
              Attachment link
            </Label>
            <Input
              id="attachment"
              type="url"
              inputMode="url"
              maxLength={ATTACHMENT_MAX}
              placeholder="https://drive.example.com/my-report.pdf"
              className="mt-1"
              invalid={Boolean(errors.attachment)}
              aria-describedby={errors.attachment ? "attachment-error" : undefined}
              {...register("attachment")}
            />
            {errors.attachment ? (
              <p id="attachment-error" className="mt-1 text-caption text-error">
                {errors.attachment.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border-muted pt-5">
          {/* The API has no draft state: a submission is live as soon as it is sent. */}
          <Button
            type="button"
            variant="ghost"
            disabled
            title="Saving a draft is not supported by the API yet"
          >
            Save Draft
          </Button>

          <Button type="submit" loading={submitAssignment.isPending}>
            {submission ? "Update Submission" : "Submit Assignment"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
