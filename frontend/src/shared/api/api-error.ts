import type { ApiFieldError } from "@/shared/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldError[];

  constructor(status: number, message: string, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors.find((error) => error.field === field)?.message;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }
}