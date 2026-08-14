"use client";

import { useDashboardMetrics } from "../../hooks/use-dashboard-metrics";
import { StatCard } from "./stat-card";

export function StatCards() {
  const metrics = useDashboardMetrics();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard key={metric.key} metric={metric} />
      ))}
    </div>
  );
}
