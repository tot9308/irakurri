import { describe, it, expect } from "vitest";
import { updateMastery, INITIAL_MASTERY, type MasteryState } from "@/lib/mastery";

describe("mastery", () => {
  it("comienza en datu_zezena con 0 intentos", () => {
    expect(INITIAL_MASTERY.state).toBe("datu_zezena");
    expect(INITIAL_MASTERY.attempts).toBe(0);
  });

  it("pasa a bidean tras 4 intentos con menos del 80% de acierto", () => {
    let m = INITIAL_MASTERY;
    m = updateMastery(m, true);
    m = updateMastery(m, false);
    m = updateMastery(m, false);
    m = updateMastery(m, false);
    expect(m.state).toBe("bidean");
    expect(m.attempts).toBe(4);
  });

  it("pasa a lortuta con >=80% de acierto en 4+ intentos", () => {
    let m = INITIAL_MASTERY;
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    expect(m.state).toBe("lortuta");
    expect(m.correct).toBe(4);
  });

  it("mantiene lo estado si no hay suficientes intentos", () => {
    let m = INITIAL_MASTERY;
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    expect(m.state).toBe("datu_zezena");
  });

  it("reinicia leitner_box a 1 tras fallo", () => {
    let m = INITIAL_MASTERY;
    m = updateMastery(m, true);
    m = updateMastery(m, true);
    expect(m.leitner_box).toBe(3);
    m = updateMastery(m, false);
    expect(m.leitner_box).toBe(1);
  });
});
