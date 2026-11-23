import { DURACIONES_MS, claveAudio } from "@/lib/audio-provider/manifest";

/** Vocales en orden de presentacion. */
export type Vocal = "a" | "e" | "i" | "o" | "u";
export const VOCALES: readonly Vocal[] = ["a", "e", "i", "o", "u"];

export interface PalabraVocal {
  /** Nombre exacto del archivo y de la palabra. */
  id: string;
  /** Vocal inicial. */
  vocal: Vocal;
}

/**
 * Palabras de las vocales. Son grabaciones completas del equipo:
 * no se generan uniendo silabas.
 */
export const PALABRAS_VOCALES: readonly PalabraVocal[] = [
  { id: "atea", vocal: "a" },
  { id: "arraina", vocal: "a" },
  { id: "armiarma", vocal: "a" },
  { id: "astoa", vocal: "a" },
  { id: "elefantea", vocal: "e" },
  { id: "erlea", vocal: "e" },
  { id: "etxea", vocal: "e" },
  { id: "eskua", vocal: "e" },
  { id: "igela", vocal: "i" },
  { id: "iglu", vocal: "i" },
  { id: "izarra", vocal: "i" },
  { id: "ilargia", vocal: "i" },
  { id: "oilarra", vocal: "o" },
  { id: "otsoa", vocal: "o" },
  { id: "ogia", vocal: "o" },
  { id: "oina", vocal: "o" },
  { id: "untxia", vocal: "u" },
  { id: "urdina", vocal: "u" },
  { id: "ura", vocal: "u" },
  { id: "usoa", vocal: "u" },
];

export function esVocal(valor: string): valor is Vocal {
  return (VOCALES as readonly string[]).includes(valor);
}

export function palabrasDeVocal(vocal: Vocal): PalabraVocal[] {
  return PALABRAS_VOCALES.filter((palabra) => palabra.vocal === vocal);
}

/** Clave del sonido aislado de la letra: vocales/a. */
export function claveAudioVocal(vocal: Vocal): string {
  return claveAudio("vocales", vocal);
}

/** Clave de la grabacion completa de una palabra de vocal. */
export function claveAudioPalabraVocal(id: string): string {
  return `vocales/palabras/${id}`;
}

/** Primera palabra de cada vocal, para la practica letra + palabra. */
export function anclasVocales(): PalabraVocal[] {
  return VOCALES.flatMap((vocal) => {
    const palabra = palabrasDeVocal(vocal)[0];
    return palabra ? [palabra] : [];
  });
}

/** Solo las palabras con grabacion completa; nunca se montan por silabas. */
export function palabrasVocalesConAudio(): PalabraVocal[] {
  return PALABRAS_VOCALES.filter(
    (palabra) => claveAudioPalabraVocal(palabra.id) in DURACIONES_MS
  );
}

export function todasLasPalabrasVocalesConAudio(): boolean {
  return palabrasVocalesConAudio().length === PALABRAS_VOCALES.length;
}
