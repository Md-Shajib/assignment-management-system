import { z } from "zod";

/** Pagination envelope documented in docs/04-API-DESIGN.md. */
export const apiMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalRecords: z.number(),
  totalPages: z.number(),
});

/** Wraps a data schema in the standard success envelope returned by the API. */
export function apiResponseEnvelope<T>(dataSchema: z.ZodType<T>) {
  return z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
    meta: apiMetaSchema.optional(),
  });
}

const fieldErrorSchema = z.object({ field: z.string(), message: z.string() });

/**
 * Error envelopes are parsed leniently: a failing response is already an error, so
 * a partially shaped body should still yield the most useful message we can find.
 * Unrecognized entries collapse to null instead of discarding the whole payload.
 */
export const apiErrorEnvelopeSchema = z
  .object({
    message: z.string().optional().catch(undefined),
    errors: z.array(fieldErrorSchema.nullable().catch(null)).optional().catch(undefined),
  })
  .catch({});
