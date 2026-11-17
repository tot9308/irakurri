"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Stage } from "./Stage";
import { SyllableChip } from "./SyllableChip";
import { ControlsBar } from "./ControlsBar";

const VOWELS = ["a", "e", "i", "o", "u"];

interface SequencePlayerProps {
  phoneme: string;
  onNext: () => void;
  onBack: () => void;
}

export function SequencePlayer({ phoneme, onNext, onBack }: SequencePlayerProps) {
  const syllables = VOWELS.map((v) => phoneme + v);
  const [visible, setVisible] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const playAudio = (s: string) => console.log("Audio:", s);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    stop();
    setVisible([]);
    indexRef.current = 0;
    setPlaying(true);
    const step = () => {
      const i = indexRef.current;
      if (i >= syllables.length) {
        setPlaying(false);
        return;
      }
      setVisible((prev) => [...prev, syllables[i]]);
      playAudio(syllables[i]);
      indexRef.current = i + 1;
      timerRef.current = setTimeout(step, 1200 / speed);
    };
    timerRef.current = setTimeout(step, 300 / speed);
  }, [syllables, speed, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-neutral-800">Fonema {phoneme}: segida</h1>
      </div>
      <Stage>
        {visible.length === 0 ? (
          <p className="text-neutral-400 text-lg">Pulsa Play para empezar</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center p-6">
            {visible.map((s, i) => (
              <SyllableChip
                key={`${s}-${i}`}
                syllable={s}
                active={i === visible.length - 1}
                onPlay={() => playAudio(s)}
              />
            ))}
          </div>
        )}
      </Stage>
      <ControlsBar
        onPlay={start}
        onRepeat={start}
        onNext={onNext}
        onBack={onBack}
        speed={speed}
        onSpeedChange={setSpeed}
        disabled={playing}
      />
    </div>
  );
}
