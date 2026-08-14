const STEP_MULTIPLIERS = [1, 2, 5, 10] as const;

export interface AxisScale {
  /** Ascending tick values, always starting at 0 and ending at `max`. */
  ticks: number[];
  max: number;
}

/**
 * Rounds a count axis up to whole-number ticks near `targetTickCount` intervals,
 * so gridlines land on readable values (0 / 10 / 20 …) instead of the raw maximum.
 */
export function buildAxisScale(maxValue: number, targetTickCount = 5): AxisScale {
  const safeMax = Math.max(Math.ceil(maxValue), 1);
  const roughStep = safeMax / targetTickCount;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const multiplier = STEP_MULTIPLIERS.find((candidate) => candidate * magnitude >= roughStep) ?? 10;
  const step = Math.max(1, Math.round(multiplier * magnitude));
  const max = Math.ceil(safeMax / step) * step;

  const ticks: number[] = [];
  for (let value = 0; value <= max; value += step) {
    ticks.push(value);
  }
  return { ticks, max };
}
