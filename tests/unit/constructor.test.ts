import { describe, it, expect } from "vitest";
import {
  colocar,
  esCorrecta,
  estadoInicial,
  limpiarError,
  quitar,
  vaciar,
} from "@/lib/fonema/constructor";

const OBJETIVO = ["ma", "mu", "a"];

describe("constructor de palabras", () => {
  it("empieza vacio y construyendo", () => {
    expect(estadoInicial()).toEqual({ colocadas: [], fase: "construyendo" });
  });

  it("coloca silabas en orden sin evaluar hasta completar", () => {
    let estado = colocar(estadoInicial(), "ma", OBJETIVO);
    expect(estado).toEqual({ colocadas: ["ma"], fase: "construyendo" });
    estado = colocar(estado, "mu", OBJETIVO);
    expect(estado.fase).toBe("construyendo");
  });

  it("marca correcto al completar la palabra", () => {
    let estado = estadoInicial();
    for (const silaba of OBJETIVO) estado = colocar(estado, silaba, OBJETIVO);
    expect(estado.fase).toBe("correcto");
    expect(esCorrecta(estado.colocadas, OBJETIVO)).toBe(true);
  });

  it("marca error si la palabra completa no coincide", () => {
    let estado = estadoInicial();
    estado = colocar(estado, "ma", OBJETIVO);
    estado = colocar(estado, "mi", OBJETIVO);
    estado = colocar(estado, "a", OBJETIVO);
    expect(estado.fase).toBe("error");
    expect(estado.colocadas).toEqual(["ma", "mi", "a"]);
  });

  it("no admite mas silabas que huecos ni cambios tras acertar", () => {
    const correcto = { colocadas: [...OBJETIVO], fase: "correcto" as const };
    expect(colocar(correcto, "ma", OBJETIVO)).toBe(correcto);
    expect(quitar(correcto, 0)).toBe(correcto);
    expect(vaciar(correcto)).toBe(correcto);

    let lleno = estadoInicial();
    for (const silaba of OBJETIVO) lleno = colocar(lleno, silaba, OBJETIVO);
    expect(colocar(lleno, "ma", OBJETIVO)).toBe(lleno);
  });

  it("quita una silaba concreta y recoloca el resto", () => {
    let estado = estadoInicial();
    estado = colocar(estado, "ma", OBJETIVO);
    estado = colocar(estado, "mu", OBJETIVO);
    estado = quitar(estado, 0);
    expect(estado).toEqual({ colocadas: ["mu"], fase: "construyendo" });
  });

  it("el error se limpia solo sin dejar dead-ends", () => {
    const error = { colocadas: ["ma", "mi", "a"], fase: "error" as const };
    expect(limpiarError(error)).toEqual(estadoInicial());
    expect(limpiarError(estadoInicial())).toEqual(estadoInicial());
  });

  it("vaciar deja el estado inicial", () => {
    const estado = colocar(estadoInicial(), "ma", OBJETIVO);
    expect(vaciar(estado)).toEqual(estadoInicial());
  });
});
