"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mic, Quote } from "lucide-react";
import type { Assignment } from "@/features/assignments/types";
import { ApiError } from "@/shared/api/api-error";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { applyFieldErrors } from "@/shared/utils/form";
import { useReviewSubmission } from "../hooks/use-review-submission";
import {
  EMPTY_REVIEW_FORM,
  REVIEW_FORM_FIELDS,
  createReviewFormSchema,
  type ReviewFormValues,
} from "../schemas/review-form-schema";
import type { Submission } from "../types";

/** Neither a rubric nor an audio note has a home in the API, so both are inert. */
const RUBRIC_UNAVAILABLE = "The API has no rubric criteria yet";
const AUDIO_UNAVAILABLE = "Audio feedback is not supported by the API yet";

const AIDE_BUTTON_CLASSES =
  "flex items-center gap-1.5 rounded-md bg-surface-container-low px-2.5 py-1.5 text-caption text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-60";

interface GradingPanelProps {
  submission: Submission;
  assignment: Assignment | null;
  className?: string;
}

export function GradingPanel({ submission, assignment, className }: GradingPanelProps) {
  const maxMarks = assignment?.maxMarks ?? null;
  const reviewSubmission = useReviewSubmission();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schema = useMemo(() => createReviewFormSchema(maxMarks), [maxMarks]);
  // Re-grading starts from what was awarded before, so the panel mirrors the record.
  const values = useMemo<ReviewFormValues>(
    () => ({
      obtainedMarks: submission.obtainedMarks?.toString() ?? "",
      teacherFeedback: submission.teacherFeedback ?? "",
    }),
    [submission.obtainedMarks, submission.teacherFeedback],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_REVIEW_FORM,
    values,
  });

  const onSubmit = async (formValues: ReviewFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await reviewSubmission.mutateAsync({
        submissionId: submission.id,
        request: {
          obtainedMarks: Number(formValues.obtainedMarks),
          teacherFeedback: formValues.teacherFeedback.trim() || undefined,
        },
      });
      setSuccessMessage("Review submitted. The student can now see the marks and feedback.");
    } catch (error) {
      if (error instanceof ApiError) {
        const unmatched = applyFieldErrors<ReviewFormValues>(
          error.fieldErrors,
          REVIEW_FORM_FIELDS,
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-full flex-col">
        <div className="space-y-5 p-6">
          <div>
            <h2 className="text-h3 tracking-tight">Grading Panel</h2>
            <p className="mt-0.5 text-caption text-on-surface-muted">
              Assignment: {assignment?.title ?? "—"}
            </p>
          </div>

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
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="obtainedMarks" className="text-label text-on-surface">
                Marks Awarded
              </Label>
              <span className="text-caption text-on-surface-muted">
                Max: {maxMarks === null ? "—" : maxMarks}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <Input
                id="obtainedMarks"
                type="number"
                inputMode="decimal"
                min={0}
                max={maxMarks ?? undefined}
                step="any"
                className="h-12 w-24 text-h3"
                invalid={Boolean(errors.obtainedMarks)}
                aria-describedby={errors.obtainedMarks ? "obtainedMarks-error" : undefined}
                {...register("obtainedMarks")}
              />
              <span className="text-h3 text-on-surface-muted">/ {maxMarks ?? "—"}</span>
            </div>

            {errors.obtainedMarks ? (
              <p id="obtainedMarks-error" className="mt-1 text-caption text-error">
                {errors.obtainedMarks.message}
              </p>
            ) : null}
          </div>

          {/*
            The design breaks the mark down per criterion. There is no rubric in the
            schema or the API, so the section states that rather than collecting
            scores that could not be stored.
          */}
          <div className="overflow-hidden rounded-md border border-border-muted">
            <div className="flex items-center justify-between gap-2 bg-surface-container-low px-3 py-2">
              <span className="text-label text-on-surface-variant">Rubric Breakdown</span>
              <button
                type="button"
                disabled
                title={RUBRIC_UNAVAILABLE}
                className="text-caption text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edit
              </button>
            </div>
            <p className="px-3 py-3 text-caption text-on-surface-muted">
              Per-criterion scoring is not available yet — marks are recorded as a single total.
            </p>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="teacherFeedback" className="text-label text-on-surface">
                Teacher Feedback
              </Label>
              <span className="text-caption text-on-surface-muted">Visible to student</span>
            </div>

            <Textarea
              id="teacherFeedback"
              rows={6}
              className="mt-1.5"
              placeholder="Explain the marks and what to improve..."
              invalid={Boolean(errors.teacherFeedback)}
              {...register("teacherFeedback")}
            />

            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" disabled title={RUBRIC_UNAVAILABLE} className={AIDE_BUTTON_CLASSES}>
                <Quote className="h-3.5 w-3.5" aria-hidden />
                Insert Rubric Phrase
              </button>
              <button type="button" disabled title={AUDIO_UNAVAILABLE} className={AIDE_BUTTON_CLASSES}>
                <Mic className="h-3.5 w-3.5" aria-hidden />
                Audio Note
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3 border-t border-border-muted p-6">
          <Button type="submit" className="w-full" loading={reviewSubmission.isPending}>
            {submission.status === "Graded" ? "Update Review" : "Submit Review"}
          </Button>

          {/* Grading is a single call; the API keeps no unpublished review draft. */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled
            title="Saving a review as a draft is not supported by the API yet"
          >
            Save Draft
          </Button>
        </div>
      </form>
    </Card>
  );
}
