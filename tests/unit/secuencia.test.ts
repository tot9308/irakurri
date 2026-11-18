import { describe, it, expect } from "vitest";
import {
  PAUSA_MINIMA_MS,
  VELOCIDADES,
  construirSecuencia,
  estadoFicha,
  intervaloRespaldo,
  intervaloSilaba,
  mostradas,
  pausaEntreSilabas,
  siguientePaso,
} from "@/lib/fonema/secuencia";
import { DURACIONES_MS, claveAudio, rutaAudio } from "@/lib/audio-provider/manifest";

describe("secuencia", () => {
  it("construye la secuencia de m en orden a-e-i-o-u", () => {
    expect(construirSecuencia("m", ["mu", "ma", "mi", "me", "mo"])).toEqual([
      "ma",
      "me",
      "mi",
      "mo",
      "mu",
    ]);
  });

  it("ignora el grafo suelto y las silabas de otro fonema", () => {
    expect(construirSecuencia("m", ["m", "ma", "ka", "me"])).toEqual(["ma", "me"]);
  });

  it("ofrece las cinco velocidades acordadas", () => {
    expect([...VELOCIDADES]).toEqual([0.5, 0.75, 1, 1.25, 1.5]);
  });

  it("la pausa decrece al subir la velocidad y respeta el suelo", () => {
    const pausas = VELOCIDADES.map((v) => pausaEntreSilabas(v));
    for (let i = 1; i < pausas.length; i += 1) {
      expect(pausas[i]).toBeLessThan(pausas[i - 1]);
    }
    expect(pausaEntreSilabas(1.5)).toBeGreaterThanOrEqual(PAUSA_MINIMA_MS);
  });

  it("suma la duracion real del audio a la pausa", () => {
    expect(intervaloSilaba(1, 300)).toBe(1000);
    expect(intervaloSilaba(0.5, 300)).toBe(1700);
  });

  it("usa un intervalo mayor de respaldo cuando no hay audio", () => {
    expect(intervaloRespaldo(1)).toBe(1100);
    expect(intervaloRespaldo(0.5)).toBe(2200);
    expect(intervaloRespaldo(0.5)).toBeGreaterThan(intervaloSilaba(0.5, 300));
  });
});

describe("estado de las fichas", () => {
  it("en inactivo no hay fichas visibles", () => {
    expect(mostradas("inactivo", 0, 5)).toBe(0);
    for (let i = 0; i < 5; i += 1) {
      expect(estadoFicha("inactivo", 0, i, 5)).toBe("oculta");
    }
  });

  it("muestra las acumuladas, activa la actual y oculta las futuras", () => {
    expect(mostradas("presentando", 2, 5)).toBe(3);
    expect(estadoFicha("presentando", 2, 0, 5)).toBe("atenuada");
    expect(estadoFicha("presentando", 2, 1, 5)).toBe("atenuada");
    expect(estadoFicha("presentando", 2, 2, 5)).toBe("activa");
    expect(estadoFicha("presentando", 2, 3, 5)).toBe("oculta");
  });

  it("al completar, todas quedan completas", () => {
    expect(mostradas("completado", 4, 5)).toBe(5);
    for (let i = 0; i < 5; i += 1) {
      expect(estadoFicha("completado", 4, i, 5)).toBe("completa");
    }
  });

  it("mantiene las ya mostradas durante una pausa", () => {
    expect(mostradas("pausado", 1, 5)).toBe(2);
    expect(estadoFicha("pausado", 1, 1, 5)).toBe("activa");
  });
});

describe("siguiente paso", () => {
  it("avanza mientras queden silabas", () => {
    expect(siguientePaso(0, 5)).toEqual({ indice: 1, completado: false });
    expect(siguientePaso(3, 5)).toEqual({ indice: 4, completado: false });
  });

  it("se completa en la ultima sin volver a la primera", () => {
    expect(siguientePaso(4, 5)).toEqual({ indice: 4, completado: true });
  });
});

describe("manifest de audio", () => {
  it("declara las cinco silabas de m con duracion positiva", () => {
    const claves = ["m/ma", "m/me", "m/mi", "m/mo", "m/mu"];
    claves.forEach((clave) => {
      expect(DURACIONES_MS[clave]).toBeGreaterThan(100);
    });
  });

  it("resuelve claves y rutas contra public/audio/v1", () => {
    expect(claveAudio("m", "ma")).toBe("m/ma");
    expect(rutaAudio("m/ma")).toBe("/audio/v1/m/ma.mp3");
  });
});
