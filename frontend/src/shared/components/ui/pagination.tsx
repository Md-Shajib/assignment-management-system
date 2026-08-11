"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiMeta } from "@/shared/types/api";

interface PaginationProps {
  meta: ApiMeta;
  onPageChange: (page: number) => void;
}

/** Renders the 1-based range covered by the current page. */
function describeRange(meta: ApiMeta): string {
  if (meta.totalRecords === 0) {
    return "No results";
  }
  const from = (meta.page - 1) * meta.pageSize + 1;
  const to = Math.min(meta.page * meta.pageSize, meta.totalRecords);
  return `Showing ${from} to ${to} of ${meta.totalRecords} results`;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const isFirstPage = meta.page <= 1;
  const isLastPage = meta.page >= meta.totalPages;

  const buttonClasses =
    "flex h-8 w-8 items-center justify-center rounded-md border border-border text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:text-on-surface-subtle disabled:hover:bg-transparent";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
      <p className="text-body-sm text-on-surface-muted">{describeRange(meta)}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClasses}
          onClick={() => onPageChange(meta.page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={buttonClasses}
          onClick={() => onPageChange(meta.page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
