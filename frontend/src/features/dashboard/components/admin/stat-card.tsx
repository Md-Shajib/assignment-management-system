import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { DashboardMetric } from "../../types";

/**
 * A single headline total.
 *
 * The design pairs each total with a period-over-period trend chip. The API keeps
 * no historical counts and exposes no date filter on the list endpoints, so there
 * is nothing to compare a period against; the chip is left out rather than filled
 * with an invented number.
 */
export function StatCard({ metric }: { metric: DashboardMetric }) {
  const { icon: Icon, label, value, isLoading, errorMessage } = metric;

  return (
    <Card className="p-5">
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-container-low text-on-surface-variant"
      >
        <Icon className="h-5 w-5" />
      </span>

      <p className="mt-4 text-body-sm text-on-surface-muted">{label}</p>

      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p
          className="mt-1 text-h1 text-on-surface"
          title={errorMessage ?? undefined}
        >
          {value === null ? "—" : value.toLocaleString()}
        </p>
      )}

      {!isLoading && errorMessage ? (
        <p className="mt-1 text-caption text-on-surface-subtle">Unavailable</p>
      ) : null}
    </Card>
  );
}
