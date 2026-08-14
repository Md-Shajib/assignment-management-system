import { cn } from "@/shared/utils/cn";
import type { WeeklyPoint } from "../types";
import { buildAxisScale } from "../utils/axis-ticks";

const PLOT_HEIGHT = "h-56";
/** Width of the y-axis gutter; the x-axis labels are offset by the same amount. */
const AXIS_GUTTER = "w-8";
const AXIS_OFFSET = "pl-11";

interface WeeklyBarChartProps {
  points: readonly WeeklyPoint[];
  /** Noun used in tooltips and labels, e.g. "published". */
  unitLabel: string;
}

function BarColumn({ point, max, unitLabel }: { point: WeeklyPoint; max: number; unitLabel: string }) {
  const heightPercent = max > 0 ? (point.value / max) * 100 : 0;

  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={`${point.fullLabel}: ${point.value} ${unitLabel}`}
      className="group relative flex h-full flex-1 items-end justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-sm bg-surface-container-low opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-60"
      />

      <div
        className="relative w-full max-w-6 rounded-t-sm bg-primary"
        style={{
          height: `${heightPercent}%`,
          minHeight: point.value > 0 ? "2px" : undefined,
        }}
      >
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-inverse-surface px-2 py-1 text-caption text-inverse-on-surface shadow-overlay group-hover:block group-focus-visible:block"
        >
          {point.fullLabel} · {point.value.toLocaleString()} {unitLabel}
        </span>
      </div>
    </div>
  );
}

/**
 * A single-series column chart. One series means no legend is needed — the card
 * title names what is plotted — and every value stays reachable without a mouse:
 * each column is focusable and labelled for assistive technology.
 */
export function WeeklyBarChart({ points, unitLabel }: WeeklyBarChartProps) {
  const { ticks, max } = buildAxisScale(Math.max(...points.map((point) => point.value), 0));
  const isEmpty = points.every((point) => point.value === 0);

  return (
    <div>
      <div className="flex gap-3">
        <div className={cn("relative shrink-0", AXIS_GUTTER, PLOT_HEIGHT)} aria-hidden>
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 text-caption tabular-nums text-on-surface-subtle"
              style={{ bottom: `${(tick / max) * 100}%` }}
            >
              {tick.toLocaleString()}
            </span>
          ))}
        </div>

        <div className={cn("relative flex-1", PLOT_HEIGHT)}>
          {ticks.map((tick) => (
            <span
              key={tick}
              aria-hidden
              className="absolute inset-x-0 border-t border-border-muted"
              style={{ bottom: `${(tick / max) * 100}%` }}
            />
          ))}

          <div className="relative flex h-full items-end gap-2">
            {points.map((point) => (
              <BarColumn key={point.date} point={point} max={max} unitLabel={unitLabel} />
            ))}
          </div>

          {isEmpty ? (
            <p className="absolute inset-0 flex items-center justify-center text-body-sm text-on-surface-muted">
              Nothing recorded this week.
            </p>
          ) : null}
        </div>
      </div>

      <div className={cn("mt-3 flex gap-2", AXIS_OFFSET)}>
        {points.map((point) => (
          <span key={point.date} className="flex-1 text-center text-caption text-on-surface-muted">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
