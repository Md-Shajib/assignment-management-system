const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

/**
 * The API serializes .NET `DateTime` values, which lose their `Z` suffix when the
 * stored `Kind` is `Unspecified`. A bare timestamp would then be read as local
 * time, so it is pinned back to UTC — every timestamp the API produces is UTC.
 */
export function parseApiDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const date = new Date(hasTimeZone || !value.includes("T") ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string {
  const date = parseApiDate(value);
  if (!date) {
    return "—";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  const date = parseApiDate(value);
  if (!date) {
    return "—";
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function pluralize(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}

/**
 * Human-readable age of a timestamp ("2 hours ago", "Yesterday at 4:30 PM").
 * `now` is injectable so the result can be asserted deterministically.
 */
export function formatRelativeTime(
  value: string | Date | null | undefined,
  now: Date = new Date(),
): string {
  const date = parseApiDate(value);
  if (!date) {
    return "—";
  }

  const elapsed = now.getTime() - date.getTime();
  if (elapsed < 0) {
    return formatDateTime(date);
  }
  if (elapsed < MINUTE_MS) {
    return "Just now";
  }
  if (elapsed < HOUR_MS) {
    return pluralize(Math.floor(elapsed / MINUTE_MS), "minute");
  }
  if (elapsed < DAY_MS) {
    return pluralize(Math.floor(elapsed / HOUR_MS), "hour");
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date.getTime() >= startOfToday.getTime() - DAY_MS) {
    return `Yesterday at ${formatTime(date)}`;
  }
  if (elapsed < WEEK_MS) {
    return `${date.toLocaleDateString(undefined, { weekday: "long" })} at ${formatTime(date)}`;
  }
  return formatDate(date);
}

export function isPast(value: string | Date): boolean {
  const date = parseApiDate(value);
  return date !== null && date.getTime() < Date.now();
}
