"use client";

import { Button } from "@/components/ui/Button";

interface ExerciseSelectorProps {
  phoneme: string;
  onSelect: (env: "sequence" | "words") => void;
  onBack: () => void;
}

export function ExerciseSelector({ phoneme, onSelect, onBack }: ExerciseSelectorProps) {
  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Fonema {phoneme}</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <button
          onClick={() => onSelect("sequence")}
          className="touch-target flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-primary-300 bg-primary-50 p-10 text-center transition-all hover:border-primary-500 hover:bg-primary-100 active:scale-95"
        >
          <span className="text-5xl">→</span>
          <span className="text-xl font-semibold text-primary-700">Segida</span>
          <span className="text-sm text-neutral-500">Silabak bata bestearen atzetik</span>
        </button>
        <button
          onClick={() => onSelect("words")}
          className="touch-target flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-10 text-center transition-all hover:border-emerald-500 hover:bg-emerald-100 active:scale-95"
        >
          <span className="text-5xl">✎</span>
          <span className="text-xl font-semibold text-emerald-700">Hitzak</span>
          <span className="text-sm text-neutral-500">Osatu hitzak silabekin</span>
        </button>
      </div>
      <div className="mt-8 flex justify-center">
        <Button variant="secondary" onClick={onBack}>Aurreratu</Button>
      </div>
    </div>
  );
}
