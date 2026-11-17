export type MasteryState = "datu_zezena" | "oraindik_ez" | "bidean" | "lortuta";

export interface AttemptRecord {
  correct: boolean;
  latency_ms: number;
  timestamp: number;
}

export interface MasteryProgress {
  attempts: number;
  correct: number;
  leitner_box: number;
  next_due: number;
  state: MasteryState;
  last_attempt?: AttemptRecord;
}

export const INITIAL_MASTERY: MasteryProgress = {
  attempts: 0,
  correct: 0,
  leitner_box: 1,
  next_due: Date.now(),
  state: "datu_zezena",
};

/**
 * Calcula el nuevo estado de dominio tras un intento.
 * Criterio: "lortuta" con >=80% de acierto en >=3 sesiones espaciadas.
 * Para simplicidad F0: >=80% en al menos 4 intentos totales.
 */
export function updateMastery(
  current: MasteryProgress,
  correct: boolean,
  now: number = Date.now()
): MasteryProgress {
  const attempts = current.attempts + 1;
  const correctCount = current.correct + (correct ? 1 : 0);
  const accuracy = correctCount / attempts;

  let state: MasteryState = current.state;
  if (attempts < 4) {
    state = "datu_zezena";
  } else if (accuracy >= 0.8) {
    state = "lortuta";
  } else {
    state = "bidean";
  }

  let leitner_box = current.leitner_box;
  if (correct) {
    leitner_box = Math.min(leitner_box + 1, 5);
  } else {
    leitner_box = 1;
  }

  // Repeticion espaciada simple: siguiente revisión en minutos segun caja Leitner
  const boxMinutes = [1, 10, 60, 1440, 10080]; // 1m, 10m, 1h, 1d, 1w
  const next_due = now + boxMinutes[leitner_box - 1] * 60 * 1000;

  return {
    attempts,
    correct: correctCount,
    leitner_box,
    next_due,
    state,
    last_attempt: { correct, latency_ms: 0, timestamp: now },
  };
}

export function distractorFor(grapheme: string, allItems: { grapheme: string }[]): string[] {
  const others = allItems.filter((i) => i.grapheme !== grapheme);
  // Distractor pedagogico: misma consonante otra vocal, o vecino fonetico
  const sameConsonant = others.filter(
    (i) => i.grapheme[0] === grapheme[0] && i.grapheme !== grapheme
  );
  const randomOthers = others
    .sort(() => 0.5 - Math.random())
    .slice(0, 3 - sameConsonant.length);
  return [...sameConsonant, ...randomOthers]
    .map((i) => i.grapheme)
    .slice(0, 3);
}
