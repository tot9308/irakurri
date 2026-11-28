import { describe, expect, it } from "vitest";
import type { LetraEdelfontmed } from "@/lib/glifos-edelfontmed";
import { PASOS_TRAZO_VOCALES } from "@/lib/pasos-trazo-vocales";

const LETRAS: readonly LetraEdelfontmed[] = [
  "a",
  "A",
  "e",
  "E",
  "i",
  "I",
  "o",
  "O",
  "u",
  "U",
];

describe("pasos de trazo de las vocales", () => {
  it("define todos los pasos con la estructura de Edelfontmed", () => {
    expect(PASOS_TRAZO_VOCALES.e).toHaveLength(2);
    expect(PASOS_TRAZO_VOCALES.o).toHaveLength(2);
    expect(PASOS_TRAZO_VOCALES.i).toHaveLength(2);
    expect(PASOS_TRAZO_VOCALES.u).toHaveLength(1);
    expect(PASOS_TRAZO_VOCALES.A).toHaveLength(3);
    expect(PASOS_TRAZO_VOCALES.E).toHaveLength(4);
  });

  it("cada paso es una ruta SVG valida", () => {
    LETRAS.forEach((letra) => {
      const pasos = PASOS_TRAZO_VOCALES[letra];
      expect(pasos.length).toBeGreaterThan(0);
      pasos.forEach((paso) => {
        expect(paso).toMatch(/^M/);
        expect(paso).not.toMatch(/NaN|Infinity/);
      });
    });
  });
});
