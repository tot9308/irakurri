import { describe, expect, it } from "vitest";
import {
  opcionesDeVocal,
  rondasDePalabrasVocales,
  rondasDeVocales,
} from "@/lib/leccion/vocales";
import { PALABRAS_VOCALES, VOCALES } from "@/lib/vocales";

describe("actividades de vocales", () => {
  it("las rondas de letras reparten las cinco vocales sin perder ninguna", () => {
    const rondas = rondasDeVocales(10, 31);
    expect(rondas).toHaveLength(10);
    VOCALES.forEach((vocal) => {
      expect(rondas.filter((r) => r === vocal)).toHaveLength(2);
    });
  });

  it("las opciones son las cinco vocales, sin repetir", () => {
    const opciones = opcionesDeVocal(31);
    expect(opciones).toHaveLength(5);
    expect(new Set(opciones).size).toBe(5);
    VOCALES.forEach((vocal) => expect(opciones).toContain(vocal));
  });

  it("las rondas de palabras usan cada palabra una vez y cinco opciones", () => {
    const rondas = rondasDePalabrasVocales(PALABRAS_VOCALES, 20, 41);
    expect(rondas).toHaveLength(20);
    expect(new Set(rondas.map((r) => r.objetivo.id)).size).toBe(20);
    rondas.forEach((ronda) => {
      expect(ronda.opciones).toHaveLength(5);
      expect(ronda.opciones).toContain(ronda.objetivo.vocal);
    });
  });
});
