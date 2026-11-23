import { describe, expect, it } from "vitest";
import { GLIFOS_EDELFONTMED } from "@/lib/glifos-edelfontmed";
import { RECORRIDOS_VOCALES } from "@/lib/recorridos-vocales";

const LETRAS = ["a", "A", "e", "E", "i", "I", "o", "O", "u", "U"];

describe("trazos de las vocales", () => {
  it("la a, la e y la o se escriben de un solo trazo", () => {
    expect(RECORRIDOS_VOCALES.a).toHaveLength(1);
    expect(RECORRIDOS_VOCALES.e).toHaveLength(1);
    expect(RECORRIDOS_VOCALES.o).toHaveLength(1);
  });

  it("tiene el glifo real y un recorrido para cada caja", () => {
    expect(Object.keys(GLIFOS_EDELFONTMED).sort()).toEqual([...LETRAS].sort());
    LETRAS.forEach((letra) => {
      const trazos = RECORRIDOS_VOCALES[letra as keyof typeof RECORRIDOS_VOCALES];
      expect(trazos.length).toBeGreaterThan(0);
      expect(GLIFOS_EDELFONTMED[letra as keyof typeof GLIFOS_EDELFONTMED]).toMatch(/^M/);
      trazos.forEach((trazo) => {
        expect(trazo).toMatch(/^M/);
        expect(trazo).not.toMatch(/NaN|Infinity/);
      });
    });
  });
});
