import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiFieldError } from "@/shared/types/api";

/**
 * Attaches server-side field errors to a form.
 *
 * Matching is case-insensitive because the API reports validation failures using
 * the server-side property name (`Email`) rather than the request field (`email`).
 * Errors that match no known field are returned so the caller can still surface them.
 */
export function applyFieldErrors<TFieldValues extends FieldValues>(
  fieldErrors: readonly ApiFieldError[],
  formFields: readonly Path<TFieldValues>[],
  setError: UseFormSetError<TFieldValues>,
): ApiFieldError[] {
  const unmatched: ApiFieldError[] = [];

  for (const fieldError of fieldErrors) {
    const match = formFields.find(
      (formField) => formField.toLowerCase() === fieldError.field.toLowerCase(),
    );
    if (match) {
      setError(match, { type: "server", message: fieldError.message });
    } else {
      unmatched.push(fieldError);
    }
  }

  return unmatched;
}
