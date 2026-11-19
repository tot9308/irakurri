import type { Palabra } from "@/lib/palabras";

/**
 * Progresion didactica de la letra (8 pasos), en el orden acordado:
 * grafema -> sintesis de silaba -> palabra-ancla -> repetir silabas ->
 * discriminacion auditiva -> pseudopalabras -> lectura de palabras -> palabra-imagen.
 */
export const PASOS = [
  "grafema",
  "silabak",
  "anclas",
  "errepikatu",
  "entzun",
  "pseudo",
  "hitzak",
  "irudia",
] as const;

export type PasoId = (typeof PASOS)[number];

export const ETIQUETAS: Record<PasoId, string> = {
  grafema: "Grafema",
  silabak: "Silaba: m + a = ma",
  anclas: "Hitza lehenengoa",
  errepikatu: "Errepikatu silabak",
  entzun: "Entzun eta aukeratu",
  pseudo: "Pseudohitzak",
  hitzak: "Irakurri hitzak",
  irudia: "Aukeratu irudia",
};

/** Nombres cortos para los botones del menu. */
export const ETIQUETAS_CORTAS: Record<PasoId, string> = {
  grafema: "Grafema",
  silabak: "Silabak",
  anclas: "Hitza",
  errepikatu: "Errepikatu",
  entzun: "Entzun eta aukeratu",
  pseudo: "Pseudohitzak",
  hitzak: "Irakurri",
  irudia: "Aukeratu irudia",
};

/** Mezcla determinista (misma semilla, mismo orden): testeable. */
export function barajar<T>(elementos: readonly T[], semilla: number): T[] {
  const copia = [...elementos];
  let estado = semilla >>> 0;
  for (let i = copia.length - 1; i > 0; i -= 1) {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    const j = estado % (i + 1);
    const temporal = copia[i];
    copia[i] = copia[j];
    copia[j] = temporal;
  }
  return copia;
}

/** Rondas de silabas en orden no alfabetico, ciclando hasta `total`. */
export function rondasDeSilabas(
  silabas: readonly string[],
  total: number,
  semilla: number
): string[] {
  const rondas: string[] = [];
  let vuelta = 0;
  while (rondas.length < total && silabas.length > 0) {
    for (const silaba of barajar(silabas, semilla + vuelta)) {
      rondas.push(silaba);
      if (rondas.length >= total) break;
    }
    vuelta += 1;
  }
  return rondas;
}

/** Opciones de una ronda auditiva: la correcta + distractoras, barajadas. */
export function opcionesDeSilaba(
  objetivo: string,
  silabas: readonly string[],
  cuantas: number,
  semilla: number
): string[] {
  const otras = barajar(
    silabas.filter((silaba) => silaba !== objetivo),
    semilla
  ).slice(0, Math.max(0, cuantas - 1));
  return barajar([objetivo, ...otras], semilla + 7);
}

export interface RondaPalabra {
  objetivo: Palabra;
  opciones: Palabra[];
}

/** Rondas palabra escrita -> 3 fotos. */
export function rondasDePalabras(
  palabras: readonly Palabra[],
  total: number,
  semilla: number
): RondaPalabra[] {
  if (palabras.length === 0) return [];
  const objetivo = rondasDePalabrasBase(palabras, total, semilla);
  return objetivo.map((palabra, indice) => {
    const otras = barajar(
      palabras.filter((p) => p.id !== palabra.id),
      semilla + indice
    ).slice(0, 2);
    return {
      objetivo: palabra,
      opciones: barajar([palabra, ...otras], semilla + indice * 3 + 1),
    };
  });
}

function rondasDePalabrasBase(
  palabras: readonly Palabra[],
  total: number,
  semilla: number
): Palabra[] {
  const rondas: Palabra[] = [];
  let vuelta = 0;
  while (rondas.length < total) {
    for (const palabra of barajar(palabras, semilla + vuelta)) {
      rondas.push(palabra);
      if (rondas.length >= total) break;
    }
    vuelta += 1;
  }
  return rondas;
}

/** Pseudopalabras CV construidas solo con silabas de la letra (a validar). */
export const PSEUDOPALABRAS = ["memi", "mimu", "mumo", "moma", "memu", "mume"];

/** "mema" -> ["me", "ma"] */
export function silabasDePseudopalabra(pseudopalabra: string): string[] {
  const silabas: string[] = [];
  for (let i = 0; i < pseudopalabra.length; i += 2) {
    silabas.push(pseudopalabra.slice(i, i + 2));
  }
  return silabas;
}

/** Primera palabra disponible que empieza por esa silaba (palabra-ancla). */
export function anclaDeSilaba(
  silaba: string,
  palabras: readonly Palabra[]
): Palabra | undefined {
  return palabras.find((palabra) => palabra.silabas[0] === silaba);
}

/** "ma" -> { consonante: "m", vocal: "a" } */
export function combinacionSilaba(
  fonema: string,
  silaba: string
): { consonante: string; vocal: string } | null {
  if (!silaba.startsWith(fonema) || silaba.length <= fonema.length) return null;
  return { consonante: fonema, vocal: silaba.slice(fonema.length) };
}
