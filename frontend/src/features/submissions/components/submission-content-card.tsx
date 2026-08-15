"use client";

import { useState } from "react";
import { Download, PenLine, SquarePlus, ZoomIn, ZoomOut } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import type { Submission } from "../types";
import { resolveAttachmentUrl } from "../utils/submission-review";

/** Reading sizes as a share of the base body size, so the type scale still applies. */
const ZOOM_LEVELS = [0.9, 1, 1.15, 1.3, 1.5] as const;
const DEFAULT_ZOOM_INDEX = 1;

const TOOL_CLASSES =
  "flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40";

/** Annotation has no storage in the API, so those tools are shown but inert. */
const ANNOTATION_UNAVAILABLE = "Annotations are not supported by the API yet";

export function SubmissionContentCard({ submission }: { submission: Submission }) {
  const [zoomIndex, setZoomIndex] = useState<number>(DEFAULT_ZOOM_INDEX);

  const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;
  const attachmentUrl = resolveAttachmentUrl(submission.attachment);
  const text = submission.submissionText?.trim() ?? "";

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border-muted px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoomIndex((index) => Math.min(index + 1, ZOOM_LEVELS.length - 1))}
            disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
            aria-label="Increase text size"
            title="Increase text size"
            className={TOOL_CLASSES}
          >
            <ZoomIn className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setZoomIndex((index) => Math.max(index - 1, 0))}
            disabled={zoomIndex <= 0}
            aria-label="Decrease text size"
            title="Decrease text size"
            className={TOOL_CLASSES}
          >
            <ZoomOut className="h-4 w-4" aria-hidden />
          </button>

          <span aria-hidden className="mx-1 h-4 w-px bg-outline-variant" />

          <button type="button" disabled aria-label="Annotate" title={ANNOTATION_UNAVAILABLE} className={TOOL_CLASSES}>
            <PenLine className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" disabled aria-label="Add note" title={ANNOTATION_UNAVAILABLE} className={TOOL_CLASSES}>
            <SquarePlus className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {attachmentUrl ? (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-label text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download attachment
          </a>
        ) : (
          <button
            type="button"
            disabled
            title={
              submission.attachment
                ? `The attachment is stored as a path, not a link: ${submission.attachment}`
                : "This submission has no attachment"
            }
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-label text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download attachment
          </button>
        )}
      </div>

      <div className="p-6">
        {text ? (
          <div
            style={{ fontSize: `${zoom * 100}%` }}
            className={cn("whitespace-pre-wrap text-body leading-relaxed text-on-surface-variant")}
          >
            {text}
          </div>
        ) : (
          <p className="text-body-sm text-on-surface-muted">
            This submission has no written response
            {submission.attachment ? "; see the attachment above." : "."}
          </p>
        )}
      </div>
    </Card>
  );
}
