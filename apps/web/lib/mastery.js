"use strict";

/** @typedef {import('./mastery').MasteryState} MasteryState */
/** @typedef {import('./mastery').MasteryProgress} MasteryProgress */

const INITIAL_MASTERY = {
  attempts: 0,
  correct: 0,
  leitner_box: 1,
  next_due: Date.now(),
  state: "datu_zezena",
};

function updateMastery(current, correct, now = Date.now()) {
  const attempts = current.attempts + 1;
  const correctCount = current.correct + (correct ? 1 : 0);
  const accuracy = correctCount / attempts;

  let state = current.state;
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

  const boxMinutes = [1, 10, 60, 1440, 10080];
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

module.exports = { updateMastery, INITIAL_MASTERY };
