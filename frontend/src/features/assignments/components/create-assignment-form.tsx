"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Calendar, Play } from "lucide-react";
import { ApiError } from "@/shared/api/api-error";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { ToggleSwitch } from "@/shared/components/ui/toggle-switch";
import { ROUTES } from "@/shared/constants";
import { applyFieldErrors } from "@/shared/utils/form";
import { useAssignableCourses } from "../hooks/use-assignable-courses";
import { useCreateAssignment, type SubmitIntent } from "../hooks/use-create-assignment";
import {
  ASSIGNMENT_FORM_FIELDS,
  EMPTY_ASSIGNMENT_FORM,
  assignmentFormSchema,
  type AssignmentFormValues,
} from "../schemas/assignment-form-schema";
import type { CreateAssignmentRequest } from "../types";
import { DescriptionEditor } from "./description-editor";

interface FieldProps {
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function Field({ htmlFor, label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-label text-on-surface-variant">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-caption text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-caption text-on-surface-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Wraps an input so a leading icon sits inside the field. */
function IconField({ icon: Icon, children }: { icon: typeof Award; children: ReactNode }) {
  return (
    <div className="relative">
      <Icon
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-subtle"
      />
      {children}
    </div>
  );
}

function toRequest(values: AssignmentFormValues): CreateAssignmentRequest {
  const request: CreateAssignmentRequest = {
    courseId: values.courseId,
    title: values.title,
    description: values.description,
    maxMarks: Number(values.maxMarks),
    deadline: new Date(values.deadline).toISOString(),
  };

  if (values.allowLateSubmissions && values.lateSubmissionEndDate) {
    request.lateSubmissionEndDate = new Date(values.lateSubmissionEndDate).toISOString();
  }
  return request;
}

export function CreateAssignmentForm() {
  const router = useRouter();
  const { courses, isLoading: isLoadingCourses, errorMessage: coursesError } = useAssignableCourses();
  const createAssignment = useCreateAssignment();

  const [serverError, setServerError] = useState<string | null>(null);
  const [draftOnlyNotice, setDraftOnlyNotice] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: EMPTY_ASSIGNMENT_FORM,
  });

  const allowLateSubmissions = useWatch({ control, name: "allowLateSubmissions" });
  const isSubmitting = createAssignment.isPending;
  const pendingIntent = createAssignment.variables?.intent;

  const onSubmit = async (values: AssignmentFormValues, intent: SubmitIntent) => {
    setServerError(null);
    setDraftOnlyNotice(null);

    try {
      const result = await createAssignment.mutateAsync({
        request: toRequest(values),
        intent,
      });

      if (result.publishErrorMessage) {
        // The draft exists now, so resubmitting would duplicate it.
        setDraftOnlyNotice(result.publishErrorMessage);
        return;
      }

      router.push(ROUTES.assignments);
    } catch (error) {
      if (error instanceof ApiError) {
        const unmatched = applyFieldErrors<AssignmentFormValues>(
          error.fieldErrors,
          ASSIGNMENT_FORM_FIELDS,
          setError,
        );
        setServerError([error.message, ...unmatched.map((item) => item.message)].join(" "));
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const hasCourses = courses.length > 0;
  const isFormLocked = draftOnlyNotice !== null;

  /** Validates, then submits with the intent the clicked control carries. */
  const submitWith = (intent: SubmitIntent) =>
    handleSubmit((values) => onSubmit(values, intent));

  return (
    <form onSubmit={submitWith("publish")} noValidate>
      <Card className="p-6">
        {serverError ? (
          <p
            role="alert"
            className="mb-6 rounded-md bg-danger-container px-3 py-2 text-body-sm text-on-danger-container"
          >
            {serverError}
          </p>
        ) : null}

        {draftOnlyNotice ? (
          <div
            role="alert"
            className="mb-6 rounded-md bg-warning-container px-3 py-2 text-body-sm text-warning"
          >
            <p>The assignment was saved as a draft, but publishing failed: {draftOnlyNotice}</p>
            <Link href={ROUTES.assignments} className="mt-1 inline-block font-semibold underline">
              Go to assignments
            </Link>
          </div>
        ) : null}

        <div className="space-y-5">
          {/* Not in the visual design, but `POST /assignments` requires a course. */}
          <Field
            htmlFor="courseId"
            label="Class"
            hint={
              coursesError
                ? undefined
                : hasCourses || isLoadingCourses
                  ? "The course this assignment belongs to."
                  : "You are not assigned to any course yet."
            }
            error={errors.courseId?.message ?? coursesError ?? undefined}
          >
            <Select
              id="courseId"
              containerClassName="w-full"
              className="h-10"
              disabled={isLoadingCourses || !hasCourses || isFormLocked}
              aria-invalid={Boolean(errors.courseId) || undefined}
              {...register("courseId")}
            >
              <option value="">{isLoadingCourses ? "Loading classes…" : "Select a class"}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code ? `${course.name} · ${course.code}` : course.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="title" label="Assignment Title" error={errors.title?.message}>
            <Input
              id="title"
              placeholder="e.g., Q3 Marketing Strategy Report"
              maxLength={200}
              invalid={Boolean(errors.title)}
              disabled={isFormLocked}
              aria-describedby={errors.title ? "title-error" : undefined}
              {...register("title")}
            />
          </Field>

          <Field
            htmlFor="description"
            label="Description"
            hint="Markdown is supported."
            error={errors.description?.message}
          >
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <DescriptionEditor
                  id="description"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fieldRef={field.ref}
                  invalid={Boolean(errors.description)}
                  describedBy={errors.description ? "description-error" : "description-hint"}
                  placeholder="Provide detailed instructions..."
                />
              )}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="maxMarks" label="Maximum Marks" error={errors.maxMarks?.message}>
              <IconField icon={Award}>
                <Input
                  id="maxMarks"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  placeholder="100"
                  className="pl-9"
                  invalid={Boolean(errors.maxMarks)}
                  disabled={isFormLocked}
                  aria-describedby={errors.maxMarks ? "maxMarks-error" : undefined}
                  {...register("maxMarks")}
                />
              </IconField>
            </Field>

            <Field htmlFor="deadline" label="Deadline" error={errors.deadline?.message}>
              <IconField icon={Calendar}>
                <Input
                  id="deadline"
                  type="datetime-local"
                  className="pl-9"
                  invalid={Boolean(errors.deadline)}
                  disabled={isFormLocked}
                  aria-describedby={errors.deadline ? "deadline-error" : undefined}
                  {...register("deadline")}
                />
              </IconField>
            </Field>
          </div>

          <div className="flex items-start justify-between gap-4 border-t border-border-muted pt-5">
            <div>
              <p id="allowLateSubmissions-label" className="text-label text-on-surface">
                Allow Late Submissions
              </p>
              <p id="allowLateSubmissions-hint" className="text-caption text-on-surface-subtle">
                Accept work after the primary deadline with a penalty flag.
              </p>
            </div>

            <Controller
              control={control}
              name="allowLateSubmissions"
              render={({ field }) => (
                <ToggleSwitch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isFormLocked}
                  labelledBy="allowLateSubmissions-label"
                  describedBy="allowLateSubmissions-hint"
                />
              )}
            />
          </div>

          {allowLateSubmissions ? (
            <Field
              htmlFor="lateSubmissionEndDate"
              label="Late Submissions Close"
              hint="Must be after the deadline."
              error={errors.lateSubmissionEndDate?.message}
            >
              <IconField icon={Calendar}>
                <Input
                  id="lateSubmissionEndDate"
                  type="datetime-local"
                  className="pl-9"
                  invalid={Boolean(errors.lateSubmissionEndDate)}
                  disabled={isFormLocked}
                  aria-describedby={
                    errors.lateSubmissionEndDate
                      ? "lateSubmissionEndDate-error"
                      : "lateSubmissionEndDate-hint"
                  }
                  {...register("lateSubmissionEndDate")}
                />
              </IconField>
            </Field>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isFormLocked || isSubmitting}
            loading={isSubmitting && pendingIntent === "draft"}
            onClick={submitWith("draft")}
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            disabled={isFormLocked || isSubmitting}
            loading={isSubmitting && pendingIntent === "publish"}
          >
            <Play className="h-4 w-4" aria-hidden />
            Publish Assignment
          </Button>
        </div>
      </Card>
    </form>
  );
}
