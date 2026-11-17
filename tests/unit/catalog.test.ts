import { describe, it, expect } from "vitest";
import { itemsByPhoneme, allPhonemes } from "@/lib/catalog";

describe("catalog", () => {
  it("devuelve fonemas ordenados", () => {
    const phonemes = allPhonemes();
    expect(phonemes.length).toBeGreaterThan(0);
    expect(phonemes[0]).toBe("m");
  });

  it("filtra items por fonema", () => {
    const mItems = itemsByPhoneme("m");
    expect(mItems.length).toBeGreaterThan(0);
    mItems.forEach((i) => expect(i.phoneme).toBe("m"));
  });

  it("no devuelve items para fonema inexistente", () => {
    const items = itemsByPhoneme("zzz");
    expect(items).toEqual([]);
  });
});
