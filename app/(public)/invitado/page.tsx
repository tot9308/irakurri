"use client";

import { useState } from "react";
import { ExerciseSelector } from "@/components/fonema/ExerciseSelector";
import { SequencePlayer } from "@/components/fonema/SequencePlayer";
import { WordBuilder } from "@/components/fonema/WordBuilder";

// Por ahora solo la m está implementada con los entornos interactivos.
// Cuando refinemos la m, iremos añadiendo el resto de fonemas.
const PHONEMES = ["m"];

type Step = "select-phoneme" | "select-env" | "sequence" | "words";

export default function InvitadoPage() {
  const [step, setStep] = useState<Step>("select-phoneme");
  const [phoneme, setPhoneme] = useState<string>("");

  const handleSelectPhoneme = (p: string) => {
    setPhoneme(p);
    setStep("select-env");
  };

  if (step === "select-phoneme") {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Aukeratu fonema</h1>
          <p className="text-neutral-600 mb-8">
            Oraingoz m fonema besterik ez dago. Lehenengo hau finduko dugu eta
            gero hurrengoak gehituko ditugu.
          </p>
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

  if (step === "select-env") {
    return (
      <ExerciseSelector
        phoneme={phoneme}
        onSelect={(env) => setStep(env === "sequence" ? "sequence" : "words")}
        onBack={() => setStep("select-phoneme")}
      />
    );
  }

  if (step === "sequence") {
    return (
      <SequencePlayer
        phoneme={phoneme}
        onNext={() => setStep("words")}
        onBack={() => setStep("select-env")}
      />
    );
  }

  return (
    <WordBuilder
      phoneme={phoneme}
      onNext={() => setStep("select-env")}
      onBack={() => setStep("select-env")}
    />
  );
}
