import { describe, expect, it } from "vitest";
import { esFormatoTexto, formatearTexto } from "@/lib/formato-texto";

describe("formato del texto", () => {
  it("reconoce solo los formatos previstos", () => {
    expect(esFormatoTexto("minuskula")).toBe(true);
    expect(esFormatoTexto("maiuskula")).toBe(true);
    expect(esFormatoTexto("nahasia")).toBe(true);
    expect(esFormatoTexto("otro")).toBe(false);
    expect(esFormatoTexto(null)).toBe(false);
  });

  it("convierte a minuscula y mayuscula", () => {
    expect(formatearTexto("aTeA", "minuskula")).toBe("atea");
    expect(formatearTexto("aTeA", "maiuskula")).toBe("ATEA");
  });

  it("en nahasia alterna solo las letras y respeta espacios y signos", () => {
    expect(formatearTexto("a e i o u", "nahasia")).toBe("a E i O u");
    expect(formatearTexto("atea", "nahasia")).toBe("aTeA");
    expect(formatearTexto("a-b", "nahasia")).toBe("a-B");
  });

  it("la semilla desplaza la alternancia en listas de opciones", () => {
    expect(formatearTexto("a", "nahasia", 0)).toBe("a");
    expect(formatearTexto("a", "nahasia", 1)).toBe("A");
    expect(formatearTexto("e", "nahasia", 1)).toBe("E");
  });
});
