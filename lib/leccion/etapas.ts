import { PASOS, type PasoId } from "./pasos";

/** Etapas del menu (opcion C: por dificultad). */
export type EtapaId = "hasi" | "finkatu" | "erabili";
export type ColorEtapa = "primary" | "amber" | "emerald";

export interface Etapa {
  id: EtapaId;
  nombre: string;
  descripcion: string;
  color: ColorEtapa;
  pasos: PasoId[];
}

export const ETAPAS: readonly Etapa[] = [
  {
    id: "hasi",
    nombre: "Hasi",
    descripcion: "Grafema, silabak eta lehen hitza",
    color: "primary",
    pasos: ["grafema", "silabak", "anclas"],
  },
  {
    id: "finkatu",
    nombre: "Finkatu",
    descripcion: "Errepikatu, entzun eta pseudohitzak",
    color: "amber",
    pasos: ["errepikatu", "entzun", "pseudo"],
  },
  {
    id: "erabili",
    nombre: "Erabili",
    descripcion: "Irakurri, ulertu eta eraiki",
    color: "emerald",
    pasos: ["hitzak", "irudia"],
  },
];

export function pasosDeEtapa(etapa: EtapaId): PasoId[] {
  return ETAPAS.find((e) => e.id === etapa)?.pasos ?? [];
}

export function etapaDePaso(paso: PasoId): EtapaId | undefined {
  return ETAPAS.find((etapa) => etapa.pasos.includes(paso))?.id;
}

/** Numero global del paso (1..8), para mostrarlo y para los aria-label. */
export function indiceGlobal(paso: PasoId): number {
  return PASOS.indexOf(paso) + 1;
}
