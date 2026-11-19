import { PASOS, type PasoId } from "./pasos";

/** Etapas del menu (opcion C: por dificultad). */
export type EtapaId = "hasi" | "finkatu" | "erabili";
export type ColorEtapa = "primary" | "amber" | "emerald";
export type PracticaId = "segida" | "hitzak";

export type ItemEtapa =
  | { tipo: "paso"; paso: PasoId }
  | { tipo: "practica"; practica: PracticaId };

export interface Etapa {
  id: EtapaId;
  nombre: string;
  descripcion: string;
  color: ColorEtapa;
  items: ItemEtapa[];
}

export const ETAPAS: readonly Etapa[] = [
  {
    id: "hasi",
    nombre: "Hasi",
    descripcion: "Grafema, silabak eta errepikapena",
    color: "primary",
    items: [
      { tipo: "paso", paso: "grafema" },
      { tipo: "paso", paso: "silabak" },
      { tipo: "practica", practica: "segida" },
      { tipo: "paso", paso: "errepikatu" },
      { tipo: "paso", paso: "anclas" },
    ],
  },
  {
    id: "finkatu",
    nombre: "Finkatu",
    descripcion: "Entzun, bereizi eta pseudohitzak",
    color: "amber",
    items: [
      { tipo: "paso", paso: "entzun" },
      { tipo: "paso", paso: "pseudo" },
      { tipo: "paso", paso: "pseudoElegir" },
    ],
  },
  {
    id: "erabili",
    nombre: "Erabili",
    descripcion: "Irakurri, ulertu eta eraiki",
    color: "emerald",
    items: [
      { tipo: "paso", paso: "hitzak" },
      { tipo: "paso", paso: "irudia" },
      { tipo: "practica", practica: "hitzak" },
    ],
  },
];

export function pasosDeEtapa(etapa: EtapaId): PasoId[] {
  const encontrada = ETAPAS.find((e) => e.id === etapa);
  return encontrada
    ? encontrada.items.flatMap((item) => (item.tipo === "paso" ? [item.paso] : []))
    : [];
}

export function etapaDePaso(paso: PasoId): EtapaId | undefined {
  return ETAPAS.find((etapa) =>
    etapa.items.some((item) => item.tipo === "paso" && item.paso === paso)
  )?.id;
}

/** Numero global del paso (1..9), para mostrarlo y para los aria-label. */
export function indiceGlobal(paso: PasoId): number {
  return PASOS.indexOf(paso) + 1;
}
