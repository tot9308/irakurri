"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ExerciseRunner } from "@/components/fonema/ExerciseRunner";

const PHONEMES = ["m", "k", "t", "l", "b", "p", "d", "n", "f", "g", "r", "rr", "j", "s", "x", "z", "ts", "tx", "tz"];

export default function InvitadoPage() {
  const [step, setStep] = useState<"select-phoneme" | "select-exercise" | "exercise">("select-phoneme");
  const [phoneme, setPhoneme] = useState<string>("");
  const [exerciseNumber, setExerciseNumber] = useState<number>(1);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (phoneme) {
      const saved = localStorage.getItem(`irakurri-exercises-${phoneme}`);
      if (saved) {
        try { setCompletedExercises(JSON.parse(saved)); } catch {}
      }
    }
  }, [phoneme]);

  const saveProgress = useCallback((exId: string) => {
    setCompletedExercises((prev) => {
      const next = { ...prev, [exId]: true };
      localStorage.setItem(`irakurri-exercises-${phoneme}`, JSON.stringify(next));
      return next;
    });
  }, [phoneme]);

  const exercises = useMemo(() => [
    { number: 1, title: "Grafema" },
    { number: 2, title: "Silabak" },
    { number: 3, title: "Escoltu eta aukeratu" },
    { number: 4, title: "Repaso" },
    { number: 5, title: "Bukatuta" },
  ], []);

  const isExerciseCompleted = (n: number) => completedExercises[`${phoneme}${n}`] === true;
  const allCompleted = exercises.every((e) => isExerciseCompleted(e.number));

  const handleSelectPhoneme = (p: string) => {
    setPhoneme(p);
    setStep("select-exercise");
    setExerciseNumber(1);
    const saved = localStorage.getItem(`irakurri-exercises-${p}`);
    if (saved) {
      try { setCompletedExercises(JSON.parse(saved)); } catch { setCompletedExercises({}); }
    } else {
      setCompletedExercises({});
    }
  };

  const handleExerciseComplete = () => {
    const exId = `${phoneme}${exerciseNumber}`;
    saveProgress(exId);
    if (exerciseNumber < 5) {
      setExerciseNumber((n) => n + 1);
    } else {
      setStep("select-exercise");
    }
  };

  if (step === "select-phoneme") {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Aukeratu fonema</h1>
          <p className="text-neutral-600 mb-8">Aukeratu fonemak nahi duzuntu eskaintza.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {PHONEMES.map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPhoneme(p)}
                className="touch-target border-2 border-neutral-300 rounded-xl bg-white p-4 text-xl font-semibold text-neutral-700 hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "select-exercise") {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Fonema {phoneme}</h1>
          <Button variant="secondary" onClick={() => setStep("select-phoneme")}>
            Aurreratu
          </Button>
        </div>
        <p className="text-neutral-600 mb-8">
          Aukeratu ejercizi bat. Ordena: 1 → 2 → 3 → 4 → 5.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {exercises.map((ex) => {
            const done = isExerciseCompleted(ex.number);
            const available = ex.number === 1 || isExerciseCompleted(ex.number - 1);
            return (
              <button
                key={ex.number}
                onClick={available ? () => setStep("exercise") : undefined}
                disabled={!available}
                className={`touch-target flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 text-center transition-all ${done
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : available
                    ? "border-primary-400 bg-primary-50 text-primary-700 hover:border-primary-600"
                    : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-bold">{ex.number}</span>
                <span className="text-sm font-medium">{ex.title}</span>
                {done && <span className="text-xs">✓</span>}
              </button>
            );
          })}
        </div>
        {allCompleted && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={() => setStep("select-phoneme")}>
              Hiru fonemara itzuli
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (step === "exercise") {
    return (
      <ExerciseRunner
        phoneme={phoneme}
        exerciseNumber={exerciseNumber}
        onComplete={handleExerciseComplete}
      />
    );
  }

  return null;
}