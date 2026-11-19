import { describe, it, expect } from "vitest";
import { ETAPAS, etapaDePaso, indiceGlobal, pasosDeEtapa } from "@/lib/leccion/etapas";
import { PASOS } from "@/lib/leccion/pasos";

describe("etapas del menu", () => {
  it("reparte los pasos en Hasi, Finkatu y Erabili", () => {
    expect(ETAPAS.map((e) => e.id)).toEqual(["hasi", "finkatu", "erabili"]);
    expect(pasosDeEtapa("hasi")).toEqual(["grafema", "silabak", "errepikatu", "anclas"]);
    expect(pasosDeEtapa("finkatu")).toEqual(["entzun", "pseudo", "pseudoElegir"]);
    expect(pasosDeEtapa("erabili")).toEqual(["hitzak", "irudia"]);
  });

  it("coloca Segida despues de Silabak y el constructor al final", () => {
    expect(ETAPAS[0].items[2]).toEqual({ tipo: "practica", practica: "segida" });
    expect(ETAPAS[2].items[2]).toEqual({ tipo: "practica", practica: "hitzak" });
  });

  it("cubre cada paso exactamente una vez", () => {
    const todos = ETAPAS.flatMap((etapa) => pasosDeEtapa(etapa.id));
    expect([...todos].sort()).toEqual([...PASOS].sort());
    expect(new Set(todos).size).toBe(todos.length);
  });

  it("cada paso pertenece a una etapa", () => {
    PASOS.forEach((paso) => expect(etapaDePaso(paso)).toBeDefined());
    expect(etapaDePaso("grafema")).toBe("hasi");
    expect(etapaDePaso("pseudoElegir")).toBe("finkatu");
    expect(etapaDePaso("irudia")).toBe("erabili");
  });

  it("mantiene la numeracion global 1..9", () => {
    expect(indiceGlobal("grafema")).toBe(1);
    expect(indiceGlobal("pseudoElegir")).toBe(7);
    expect(indiceGlobal("irudia")).toBe(9);
  });
});
