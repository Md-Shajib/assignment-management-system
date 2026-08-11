import type { z } from "zod";
import { API_BASE_URL } from "@/config/api";
import { ApiError } from "./api-error";
import { apiErrorEnvelopeSchema, apiResponseEnvelope } from "./api-schemas";
import { getAccessToken } from "./token-store";
import { notifyUnauthorized } from "./unauthorized-handler";
import type { ApiResponse } from "@/shared/types/api";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

/** Parses a response body, returning null when it is absent or not valid JSON. */
function parseJson(text: string): unknown {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper around the API. Every response is validated against a Zod
 * schema before it reaches the caller, so no unchecked server data enters the app.
 */
export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  get<T>(path: string, schema: z.ZodType<T>, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request(path, schema, { ...options, method: "GET" });
  }

  post<T>(
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request(path, schema, { ...options, method: "POST", body });
  }

  put<T>(
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request(path, schema, { ...options, method: "PUT", body });
  }

  patch<T>(
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request(path, schema, { ...options, method: "PATCH", body });
  }

  delete<T>(path: string, schema: z.ZodType<T>, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request(path, schema, { ...options, method: "DELETE" });
  }

  private async request<T>(
    path: string,
    schema: z.ZodType<T>,
    options: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const { params, body, headers, ...rest } = options;
    const url = this.buildUrl(path, params);
    const token = getAccessToken();

    const response = await fetch(url, {
      ...rest,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    const text = await response.text().catch(() => "");
    const payload = parseJson(text);

    if (!response.ok) {
      // Only an authenticated request can invalidate the session; a rejected
      // login is a form error, not an expired session.
      if (response.status === 401 && token) {
        notifyUnauthorized();
      }

      const parsed = apiErrorEnvelopeSchema.safeParse(payload);
      const errorPayload = parsed.success ? parsed.data : null;
      const message = errorPayload?.message?.trim();
      throw new ApiError(
        response.status,
        message ? message : `Request failed with status ${response.status}`,
        errorPayload?.errors?.filter((error) => error !== null) ?? [],
      );
    }

    // A body-less success (204) is validated too, so callers must opt in with a
    // schema that accepts no data.
    const envelope = apiResponseEnvelope(schema).safeParse(
      payload ?? { success: true, message: "", data: undefined },
    );
    if (!envelope.success) {
      throw new ApiError(response.status, "Received an unexpected response from the server.");
    }
    return envelope.data;
  }

  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    let url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
      }
    }
    return url;
  }
}

export const httpClient = new HttpClient();
