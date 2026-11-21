import { describe, it, expect } from "vitest";
import {
  PALABRAS,
  bancoDeSilabas,
  claveAudioPalabra,
  palabrasConAudio,
  palabrasDeFonema,
  palabrasParaConstruir,
  rutaImagenPalabra,
  textoPalabra,
} from "@/lib/palabras";
import { DURACIONES_MS, claveSilaba, fonemasConAudio } from "@/lib/audio-provider/manifest";

describe("palabras", () => {
  it("incluye las palabras validadas de la m", () => {
    expect(palabrasDeFonema("m").map((p) => p.id)).toEqual([
      "mamua",
      "umea",
      "mimo",
      "ama",
      "amama",
      "momia",
      "meloi",
      "musu",
    ]);
  });

  it("descompone en silabas que reconstruyen la palabra", () => {
    PALABRAS.forEach((palabra) => {
      expect(textoPalabra(palabra)).toBe(palabra.id);
      expect(palabra.silabas.length).toBeGreaterThan(0);
      palabra.silabas.forEach((silaba) => {
        expect(silaba).toBe(silaba.toLowerCase());
        expect(silaba.length).toBeLessThanOrEqual(3);
      });
      expect(palabra.silabas.some((silaba) => silaba.includes(palabra.fonema))).toBe(true);
    });
  });

  it("solo ofrece palabras con grabacion completa, nunca unidas por silabas", () => {
    const disponibles = palabrasConAudio("m");
    expect(disponibles.map((p) => p.id)).toEqual([
      "mamua",
      "umea",
      "mimo",
      "ama",
      "amama",
      "momia",
      "meloi",
      "musu",
    ]);
    disponibles.forEach((palabra) => {
      expect(claveAudioPalabra(palabra) in DURACIONES_MS).toBe(true);
    });
  });

  it("construye la ruta de la foto versionada", () => {
    expect(rutaImagenPalabra("mimo", "png")).toBe("/img/v1/palabras/mimo.png");
  });

  it("el banco no duplica y limita los distractores", () => {
    const banco = bancoDeSilabas(["a", "ma", "ma"], ["ma", "me", "mi", "mo"], 2);
    expect(banco).toEqual(["a", "ma", "me", "mi"]);
    expect(new Set(banco).size).toBe(banco.length);
  });

  it("las vocales usan la clave compartida, no la del fonema", () => {
    expect(claveSilaba("m", "a")).toBe("vocales/a");
    expect(claveSilaba("m", "ma")).toBe("m/ma");
  });

  it("el constructor solo usa palabras con todas sus silabas grabadas", () => {
    const construir = palabrasParaConstruir("m").map((p) => p.id);
    expect(construir).toContain("mimo");
    expect(construir).not.toContain("meloi");
    expect(construir).not.toContain("musu");
    construir.forEach((id) => {
      const palabra = palabrasDeFonema("m").find((p) => p.id === id);
      expect(palabra).toBeDefined();
      if (!palabra) return;
      expect(claveAudioPalabra(palabra) in DURACIONES_MS).toBe(true);
    });
  });

  it("deriva del manifest los fonemas disponibles", () => {
    expect(fonemasConAudio()).toEqual(["m"]);
  });
});
