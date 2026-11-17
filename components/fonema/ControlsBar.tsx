"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

interface ControlsBarProps {
  onPlay: () => void;
  onRepeat: () => void;
  onNext: () => void;
  onBack: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export function ControlsBar({
  onPlay,
  onRepeat,
  onNext,
  onBack,
  speed,
  onSpeedChange,
  disabled = false,
}: ControlsBarProps) {
  return (
    <div className="flex flex-col items-center gap-4 pt-8 sm:flex-row sm:justify-between">
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onPlay} disabled={disabled} size="lg">
          ▶ Play
        </Button>
        <Button variant="secondary" onClick={onRepeat} disabled={disabled} size="lg">
          Repetir
        </Button>
        <Button variant="secondary" onClick={onBack} size="lg">
          Aurreratu
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <span>Sarrera:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSpeedChange(0.5)}
          className={`px-3 py-1.5 rounded-lg ${speed === 0.5 ? "bg-primary-100 text-primary-700" : ""}`}
        >
          0.5x
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSpeedChange(1)}
          className={`px-3 py-1.5 rounded-lg ${speed === 1 ? "bg-primary-100 text-primary-700" : ""}`}
        >
          1x
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSpeedChange(1.5)}
          className={`px-3 py-1.5 rounded-lg ${speed === 1.5 ? "bg-primary-100 text-primary-700" : ""}`}
        >
          1.5x
        </Button>
      </div>
      <Button variant="primary" onClick={onNext} disabled={disabled} size="lg">
        Hurrengoa
      </Button>
    </div>
  );
}
