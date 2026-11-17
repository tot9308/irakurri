"use client";

import { useState } from "react";
import { Stage } from "./Stage";
import { ControlsBar } from "./ControlsBar";
import { Button } from "@/components/ui/Button";

// TODO: revisar euskera y sustituir por palabras reales validadas
const WORDS = [
  { word: "mama", syllables: ["ma", "ma"] },
  { word: "mimi", syllables: ["mi", "mi"] },
];

interface WordBuilderProps {
  phoneme: string;
  onNext: () => void;
  onBack: () => void;
}

export function WordBuilder({ onNext, onBack }: WordBuilderProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [speed, setSpeed] = useState(1);

  const word = WORDS[wordIndex];
  const bank = ["ma", "me", "mi", "mo", "mu"];

  const playAudio = (s: string) => console.log("Audio:", s);

  const selectSyllable = (s: string) => {
    if (feedback !== null) return;
    const next = [...placed, s];
    setPlaced(next);
    playAudio(s);
    if (next.length === word.syllables.length) {
      const ok = next.join("") === word.word;
      setFeedback(ok ? "correct" : "wrong");
      if (ok) playAudio(word.word);
    }
  };

  const removeLast = () => {
    if (feedback !== null) return;
    setPlaced(placed.slice(0, -1));
  };

  const clearAll = () => {
    if (feedback !== null) return;
    setPlaced([]);
  };

  const nextWord = () => {
    setPlaced([]);
    setFeedback(null);
    setWordIndex((wordIndex + 1) % WORDS.length);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <p className="text-lg text-neutral-600">Osatu hitza:</p>
        <p className="text-3xl font-bold text-primary-700">{word.word}</p>
        <button
          onClick={() => playAudio(word.word)}
          className="mt-2 text-sm text-primary-600 underline"
        >
          Soinua
        </button>
      </div>
      <Stage>
        <div className="flex flex-col items-center gap-6 w-full p-6">
          <div className="flex gap-3 min-h-[100px] items-center justify-center w-full border-b-4 border-neutral-300 pb-4">
            {placed.length === 0 ? (
              <p className="text-neutral-400">Toca las sílabas para formar la palabra</p>
            ) : (
              placed.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 text-4xl font-bold text-emerald-700"
                >
                  {s}
                </div>
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {bank.map((s) => (
              <button
                key={s}
                onClick={() => selectSyllable(s)}
                className="touch-target rounded-2xl border-2 border-neutral-300 bg-white p-6 text-4xl font-bold hover:border-primary-400 hover:bg-primary-50 active:bg-primary-100"
                aria-label={`Silaba ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Stage>
      <div className="mt-4 flex flex-col items-center gap-3">
        {feedback === "correct" && <p className="text-emerald-700 text-xl font-semibold">Zuzen!</p>}
        {feedback === "wrong" && <p className="text-rose-700 text-xl font-semibold">Huts. Saiatu berriro.</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={removeLast} disabled={placed.length === 0}>Kendu</Button>
          <Button variant="secondary" onClick={clearAll} disabled={placed.length === 0}>Garbitu</Button>
          {feedback === "correct" && <Button onClick={nextWord}>Hurrengo hitza</Button>}
        </div>
      </div>
      <ControlsBar
        onPlay={() => playAudio(word.word)}
        onRepeat={() => playAudio(word.word)}
        onNext={onNext}
        onBack={onBack}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
