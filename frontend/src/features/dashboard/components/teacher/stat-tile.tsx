import type { LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";

export type StatTone = "primary" | "danger" | "warning" | "neutral";

const TONE_CLASSES: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  danger: "bg-danger-container text-danger",
  warning: "bg-warning-container text-warning",
  neutral: "bg-surface-container-low text-on-surface-variant",
};

/** Meter fill and its track, a lighter step of the same ramp. */
const METER_CLASSES: Record<StatTone, { track: string; fill: string }> = {
  primary: { track: "bg-primary/15", fill: "bg-primary" },
  danger: { track: "bg-danger-container", fill: "bg-danger" },
  warning: { track: "bg-warning-container", fill: "bg-warning" },
  neutral: { track: "bg-surface-container", fill: "bg-on-surface-variant" },
};

export interface StatTileProps {
  icon: LucideIcon;
  tone: StatTone;
  label: string;
  /** Preformatted so a tile can show "85%" as readily as "42". */
  value: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  badge?: { text: string; variant?: BadgeProps["variant"] };
  /** 0–100. Renders a meter under the label; its color follows `meterTone`. */
  meterPercent?: number | null;
  meterTone?: StatTone;
}

export function StatTile({
  icon: Icon,
  tone,
  label,
  value,
  isLoading,
  errorMessage,
  badge,
  meterPercent,
  meterTone = tone,
}: StatTileProps) {
  const meter = METER_CLASSES[meterTone];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={cn("flex h-10 w-10 items-center justify-center rounded-md", TONE_CLASSES[tone])}
        >
          <Icon className="h-5 w-5" />
        </span>

        {!isLoading && badge ? <Badge variant={badge.variant}>{badge.text}</Badge> : null}
      </div>

      {isLoading ? (
        <Skeleton className="mt-4 h-8 w-20" />
      ) : (
        <p className="mt-4 text-h1 text-on-surface" title={errorMessage ?? undefined}>
          {value ?? "—"}
        </p>
      )}

      <p className="mt-1 text-body-sm text-on-surface-muted">{label}</p>

      {!isLoading && errorMessage ? (
        <p className="mt-1 text-caption text-on-surface-subtle">Unavailable</p>
      ) : null}

      {!isLoading && !errorMessage && meterPercent !== null && meterPercent !== undefined ? (
        <div
          role="meter"
          aria-valuenow={meterPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          className={cn("mt-3 h-1.5 w-full overflow-hidden rounded-sm", meter.track)}
        >
          <div
            className={cn("h-full rounded-sm", meter.fill)}
            style={{ width: `${Math.min(Math.max(meterPercent, 0), 100)}%` }}
          />
        </div>
      ) : null}
    </Card>
  );
}
