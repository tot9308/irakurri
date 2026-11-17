import * as React from "react";
import { OptionTile } from "@/components/ui/OptionTile";

interface OpcionesProps {
  correct: string;
  options: string[];
  onSelect: (value: string) => void;
  selected?: string;
  feedback?: "correct" | "wrong" | null;
  disabled?: boolean;
}

export function Opciones({
  correct,
  options,
  onSelect,
  selected,
  feedback = null,
  disabled = false,
}: OpcionesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {options.map((opt) => {
        const state =
          feedback === null
            ? ("idle" as const)
            : opt === correct
              ? ("correct" as const)
              : opt === selected
                ? ("wrong" as const)
                : ("idle" as const);
        return (
          <OptionTile
            key={opt}
            value={opt}
            label={opt}
            state={state}
            onSelect={onSelect}
            disabled={disabled || feedback !== null}
          />
        );
      })}
    </div>
  );
}
