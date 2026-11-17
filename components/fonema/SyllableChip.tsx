"use client";

import * as React from "react";

interface SyllableChipProps {
  syllable: string;
  active?: boolean;
  onPlay?: () => void;
  className?: string;
}

export function SyllableChip({
  syllable,
  active = false,
  onPlay,
  className,
}: SyllableChipProps) {
  return (
    <div
      className={`relative group cursor-pointer touch-target rounded-2xl border-2 p-6 text-4xl font-bold transition-all duration-300 ${
        active
          ? "border-primary-600 bg-primary-100 text-primary-800 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          : "border-neutral-300 bg-white text-neutral-800 hover:border-primary-400 hover:bg-primary-50"
      } ${className ?? ""}`}
      onClick={onPlay}
      aria-label={`Silaba ${syllable}`}
      role="button"
      tabIndex={0}
    >
      <span>{syllable}</span>
      {active && (
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          ✓
        </span>
      )}
    </div>
  );
}
