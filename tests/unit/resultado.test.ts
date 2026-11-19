import { describe, it, expect } from "vitest";
import { estrellas, mensajeResultado } from "@/lib/leccion/resultado";

describe("resultado del ejercicio", () => {
  it("da tres estrellas si todo esta bien", () => {
    expect(estrellas(12, 12)).toBe(3);
    expect(estrellas(6, 6)).toBe(3);
  });

  it("da dos estrellas con la mayoria acertada", () => {
    expect(estrellas(6, 12)).toBe(2);
    expect(estrellas(3, 6)).toBe(2);
    expect(estrellas(11, 12)).toBe(2);
  });

  it("da una estrella por debajo de la mitad", () => {
    expect(estrellas(5, 12)).toBe(1);
    expect(estrellas(0, 6)).toBe(1);
  });

  it("no rompe sin rondas", () => {
    expect(estrellas(0, 0)).toBe(1);
  });

  it("mensajes cualitativos, nunca numericos", () => {
    expect(mensajeResultado(3)).toBe("Bikain!");
    expect(mensajeResultado(2)).toBe("Oso ondo!");
    expect(mensajeResultado(1)).toBe("Ondo! Segi praktikatzen.");
  });
});
