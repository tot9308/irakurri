import { describe, it, expect } from "vitest";
import {
  PASOS,
  PSEUDOPALABRAS,
  anclaDeSilaba,
  barajar,
  combinacionSilaba,
  opcionesDeSilaba,
  rondasDePalabras,
  rondasDeSilabas,
  silabasDePseudopalabra,
} from "@/lib/leccion/pasos";
import { palabrasDeFonema } from "@/lib/palabras";

const SILABAS = ["ma", "me", "mi", "mo", "mu"];
const PALABRAS = palabrasDeFonema("m");

describe("leccion de la letra", () => {
  it("define los ocho pasos en el orden acordado", () => {
    expect(PASOS).toEqual([
      "grafema",
      "silabak",
      "anclas",
      "errepikatu",
      "entzun",
      "pseudo",
      "hitzak",
      "irudia",
    ]);
  });

  it("baraja de forma determinista y conserva los elementos", () => {
    expect(barajar(SILABAS, 42)).toEqual(barajar(SILABAS, 42));
    expect([...barajar(SILABAS, 7)].sort()).toEqual([...SILABAS].sort());
    expect(barajar(SILABAS, 1)).not.toEqual(SILABAS);
  });

  it("genera 12 rondas de repeticion con las cinco silabas", () => {
    const rondas = rondasDeSilabas(SILABAS, 12, 3);
    expect(rondas).toHaveLength(12);
    rondas.forEach((ronda) => expect(SILABAS).toContain(ronda));
    expect(rondas.slice(0, 5).sort()).toEqual([...SILABAS].sort());
  });

  it("cada ronda auditiva tiene la correcta y cuatro distractoras sin repetir", () => {
    const opciones = opcionesDeSilaba("mu", SILABAS, 5, 11);
    expect(opciones).toHaveLength(5);
    expect(opciones).toContain("mu");
    expect(new Set(opciones).size).toBe(5);
  });

  it("genera rondas palabra escrita -> 3 fotos sin repetir opciones", () => {
    const rondas = rondasDePalabras(PALABRAS, 6, 5);
    expect(rondas).toHaveLength(6);
    rondas.forEach((ronda) => {
      expect(ronda.opciones).toHaveLength(3);
      expect(ronda.opciones.map((p) => p.id)).toContain(ronda.objetivo.id);
      expect(new Set(ronda.opciones.map((p) => p.id)).size).toBe(3);
    });
  });

  it("descompone pseudopalabras CV", () => {
    expect(silabasDePseudopalabra("mema")).toEqual(["me", "ma"]);
    expect(silabasDePseudopalabra("mumo")).toEqual(["mu", "mo"]);
    PSEUDOPALABRAS.forEach((pseudo) => {
      expect(silabasDePseudopalabra(pseudo).join("")).toBe(pseudo);
    });
  });

  it("encuentra la palabra-ancla por su primera silaba", () => {
    const ancla = anclaDeSilaba("ma", PALABRAS);
    expect(ancla?.silabas[0]).toBe("ma");
    // Si hay ancla, empieza por esa silaba; si no, no se inventa.
    SILABAS.forEach((silaba) => {
      const encontrada = anclaDeSilaba(silaba, PALABRAS);
      if (encontrada) expect(encontrada.silabas[0]).toBe(silaba);
    });
  });

  it("separa consonante y vocal de la silaba", () => {
    expect(combinacionSilaba("m", "ma")).toEqual({ consonante: "m", vocal: "a" });
    expect(combinacionSilaba("m", "mu")).toEqual({ consonante: "m", vocal: "u" });
    expect(combinacionSilaba("m", "m")).toBeNull();
    expect(combinacionSilaba("m", "ka")).toBeNull();
  });
});
