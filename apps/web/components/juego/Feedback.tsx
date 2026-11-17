import * as React from "react";

interface FeedbackProps {
  correct: boolean;
  grapheme: string;
  onRepeat: () => void;
}

export function Feedback({ correct, grapheme, onRepeat }: FeedbackProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 p-4 rounded-xl"
      role="status"
      aria-live="polite"
    >
      {correct ? (
        <div className="flex flex-col items-center gap-2 text-emerald-700">
          <span className="text-6xl">✓</span>
          <span className="text-xl font-semibold">Zuzen!</span>
          <span className="text-neutral-600">
            Aurkeztu duzu: <strong className="capitalize">{grapheme}</strong>
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-rose-700">
          <span className="text-6xl">·</span>
          <span className="text-xl font-semibold">Huts</span>
          <span className="text-neutral-600">
            Saiatu berriro. <strong className="capitalize">{grapheme}</strong> aurkituta da.
          </span>
        </div>
      )}
      <button
        className="btn-secondary"
        onClick={onRepeat}
        aria-label="Soinua errepikatu"
      >
        Soinua errepikatu
      </button>
    </div>
  );
}
