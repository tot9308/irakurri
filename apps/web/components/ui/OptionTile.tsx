import * as React from "react";

export type OptionTileState = "idle" | "selected" | "correct" | "wrong";

interface OptionTileProps {
  value: string;
  label: string;
  state?: OptionTileState;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function OptionTile({
  value,
  label,
  state = "idle",
  onSelect,
  disabled = false,
}: OptionTileProps) {
  const classes = [
    "option-tile touch-target transition-all duration-200",
    state === "selected" && "option-tile.selected",
    state === "correct" && "option-tile.correct",
    state === "wrong" && "option-tile.wrong",
    disabled && "opacity-60 cursor-not-allowed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      aria-pressed={state !== "idle"}
      aria-label={label}
    >
      <span className="font-semibold">{label}</span>
    </button>
  );
}
