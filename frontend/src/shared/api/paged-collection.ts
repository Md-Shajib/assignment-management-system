import { MAX_PAGE_SIZE } from "@/shared/constants";
import type { ApiResponse } from "@/shared/types/api";

export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface PagedCollection<T> {
  items: T[];
  /** Size of the full collection, taken from the pagination envelope. */
  totalRecords: number;
  /** `false` when `maxPages` stopped the walk before the API ran out of pages. */
  isComplete: boolean;
}

interface FetchPagedCollectionOptions {
  pageSize?: number;
  /** Hard cap on requests, so a large collection cannot flood the browser. */
  maxPages?: number;
}

/**
 * Walks a paginated list endpoint and returns the collected rows.
 *
 * The API exposes no aggregate endpoints, so views that need totals or
 * cross-record derivations have to read the rows themselves. The first response
 * already carries `totalRecords`, which is why a count-only caller can pass
 * `pageSize: 1` and ignore `items`.
 */
export async function fetchPagedCollection<T>(
  fetchPage: (request: PageRequest) => Promise<ApiResponse<T[]>>,
  { pageSize = MAX_PAGE_SIZE, maxPages = 1 }: FetchPagedCollectionOptions = {},
): Promise<PagedCollection<T>> {
  const firstPage = await fetchPage({ page: 1, pageSize });
  const totalPages = firstPage.meta?.totalPages ?? 1;
  const totalRecords = firstPage.meta?.totalRecords ?? firstPage.data.length;
  const pagesFetched = Math.min(totalPages, Math.max(maxPages, 1));

  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(pagesFetched - 1, 0) }, (_, index) =>
      fetchPage({ page: index + 2, pageSize }),
    ),
  );

  return {
    items: [firstPage, ...remainingPages].flatMap((response) => response.data),
    totalRecords,
    isComplete: totalPages <= pagesFetched,
  };
}
