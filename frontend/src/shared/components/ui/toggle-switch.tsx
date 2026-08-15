import { cn } from "@/shared/utils/cn";

export interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Id of the element naming the switch, since it renders no visible text. */
  labelledBy?: string;
  describedBy?: string;
  disabled?: boolean;
  id?: string;
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  labelledBy,
  describedBy,
  disabled = false,
  id,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-primary" : "bg-surface-container-high",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-5 w-5 rounded-xl bg-surface-container-lowest shadow-overlay transition-transform",
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
