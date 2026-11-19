import { describe, it, expect } from "vitest";
import { ETAPAS, etapaDePaso, indiceGlobal, pasosDeEtapa } from "@/lib/leccion/etapas";
import { PASOS } from "@/lib/leccion/pasos";

describe("etapas del menu", () => {
  it("reparte los ocho pasos en Hasi, Finkatu y Erabili", () => {
    expect(ETAPAS.map((e) => e.id)).toEqual(["hasi", "finkatu", "erabili"]);
    expect(pasosDeEtapa("hasi")).toEqual(["grafema", "silabak", "anclas"]);
    expect(pasosDeEtapa("finkatu")).toEqual(["errepikatu", "entzun", "pseudo"]);
    expect(pasosDeEtapa("erabili")).toEqual(["hitzak", "irudia"]);
  });

  it("cubre cada paso exactamente una vez", () => {
    const todos = ETAPAS.flatMap((etapa) => etapa.pasos);
    expect([...todos].sort()).toEqual([...PASOS].sort());
    expect(new Set(todos).size).toBe(todos.length);
  });

  it("cada paso pertenece a una etapa", () => {
    PASOS.forEach((paso) => expect(etapaDePaso(paso)).toBeDefined());
    expect(etapaDePaso("grafema")).toBe("hasi");
    expect(etapaDePaso("entzun")).toBe("finkatu");
    expect(etapaDePaso("irudia")).toBe("erabili");
  });

  it("mantiene la numeracion global 1..8", () => {
    expect(indiceGlobal("grafema")).toBe(1);
    expect(indiceGlobal("irudia")).toBe(8);
    expect(indiceGlobal("pseudo")).toBe(6);
  });
});
