import { describe, expect, it } from "vitest";
import { DURACIONES_MS } from "@/lib/audio-provider/manifest";
import {
  PALABRAS_VOCALES,
  VOCALES,
  anclasVocales,
  claveAudioPalabraVocal,
  claveAudioVocal,
  palabrasDeVocal,
  palabrasVocalesConAudio,
  todasLasPalabrasVocalesConAudio,
} from "@/lib/vocales";

describe("palabras de las vocales", () => {
  it("tiene cuatro palabras por vocal y la cuarta de la i es ilargia", () => {
    expect(PALABRAS_VOCALES).toHaveLength(20);
    VOCALES.forEach((vocal) => {
      expect(palabrasDeVocal(vocal)).toHaveLength(4);
    });
    expect(palabrasDeVocal("i").map((p) => p.id)).toEqual([
      "igela",
      "iglu",
      "izarra",
      "ilargia",
    ]);
  });

  it("cada palabra empieza por la vocal que declara", () => {
    PALABRAS_VOCALES.forEach((palabra) => {
      expect(palabra.id.startsWith(palabra.vocal)).toBe(true);
      expect(palabra.id).toBe(palabra.id.toLowerCase());
    });
  });

  it("usa claves de audio separadas para letras y palabras", () => {
    expect(claveAudioVocal("a")).toBe("vocales/a");
    expect(claveAudioPalabraVocal("atea")).toBe("vocales/palabras/atea");
  });

  it("las anclas son la primera palabra de cada vocal", () => {
    expect(anclasVocales().map((p) => p.id)).toEqual([
      "atea",
      "elefantea",
      "igela",
      "oilarra",
      "untxia",
    ]);
  });

  it("solo devuelve palabras con grabacion completa", () => {
    const disponibles = palabrasVocalesConAudio();
    disponibles.forEach((palabra) => {
      expect(claveAudioPalabraVocal(palabra.id) in DURACIONES_MS).toBe(true);
    });
    expect(todasLasPalabrasVocalesConAudio()).toBe(disponibles.length === 20);
  });
});
