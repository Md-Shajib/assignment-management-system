import { BookOpen, CircleCheck, FilePen, FileText, Lock, Upload, type LucideIcon } from "lucide-react";
import { formatDateTime, formatRelativeTime } from "@/shared/utils/date";
import type { ActivityItem, ActivityKind } from "../../types";

const KIND_ICONS: Record<ActivityKind, LucideIcon> = {
  "assignment-published": FileText,
  "assignment-drafted": FilePen,
  "assignment-closed": Lock,
  "submission-received": Upload,
  "submission-graded": CircleCheck,
  "course-created": BookOpen,
};

export function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = KIND_ICONS[item.kind];

  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-on-surface-variant"
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="text-body-sm text-on-surface-variant">
          {item.segments.map((segment, index) => (
            <span
              key={`${item.id}-${index}`}
              className={segment.emphasis ? "font-semibold text-on-surface" : undefined}
            >
              {segment.text}
            </span>
          ))}
        </p>
        <p className="mt-0.5 text-caption text-on-surface-subtle" title={formatDateTime(item.occurredAt)}>
          {formatRelativeTime(item.occurredAt)}
        </p>
      </div>
    </li>
  );
}
