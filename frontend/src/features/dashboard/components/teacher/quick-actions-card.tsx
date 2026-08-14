"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FileCheck2, MessageSquareText, SquarePen } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";
import { useTeacherSubmissions } from "../../hooks/use-teacher-submissions";

const ACTION_CLASSES =
  "flex w-full items-center gap-3 rounded-md border border-border-muted p-4 text-left transition-colors";

interface ActionBodyProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function ActionBody({ icon: Icon, title, description }: ActionBodyProps) {
  return (
    <>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-on-surface-variant"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-body-sm font-semibold text-on-surface">{title}</span>
        <span className="block truncate text-caption text-on-surface-muted">{description}</span>
      </span>
    </>
  );
}

/**
 * Only grading has a destination today: there is no assignment-authoring screen
 * yet, and the API has no messaging endpoint at all, so those two are disabled
 * rather than linked somewhere that cannot fulfil them.
 */
export function QuickActionsCard({ className }: { className?: string }) {
  const { pendingCount, isLoading } = useTeacherSubmissions();

  const pendingLabel = isLoading
    ? "Checking pending items"
    : `${pendingCount.toLocaleString()} pending item${pendingCount === 1 ? "" : "s"}`;

  return (
    <Card className={cn("p-6", className)}>
      <h2 className="text-h3 tracking-tight">Quick Actions</h2>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          disabled
          title="Creating assignments is not available yet"
          className={cn(ACTION_CLASSES, "disabled:cursor-not-allowed disabled:opacity-60")}
        >
          <ActionBody icon={SquarePen} title="New Assignment" description="Create a task for students" />
        </button>

        <Link href={ROUTES.submissions} className={cn(ACTION_CLASSES, "hover:bg-surface-container-low")}>
          <ActionBody icon={FileCheck2} title="Grade Submissions" description={pendingLabel} />
        </Link>

        <button
          type="button"
          disabled
          title="The API has no messaging endpoint yet"
          className={cn(ACTION_CLASSES, "disabled:cursor-not-allowed disabled:opacity-60")}
        >
          <ActionBody
            icon={MessageSquareText}
            title="Message Class"
            description="Send announcement"
          />
        </button>
      </div>
    </Card>
  );
}
