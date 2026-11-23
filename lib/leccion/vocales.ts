/**
 * Logica pura de las actividades de vocales (sin DOM, sin React).
 * Las opciones siempre son las cinco vocales; no hay distractores inventados.
 */
import type { PalabraVocal, Vocal } from "@/lib/vocales";
import { VOCALES } from "@/lib/vocales";
import { barajar } from "./pasos";

export interface RondaVocal {
  objetivo: Vocal;
  opciones: Vocal[];
}

export interface RondaPalabraVocal {
  objetivo: PalabraVocal;
  opciones: Vocal[];
}

/** Las cinco vocales barajadas; la correcta siempre esta entre ellas. */
export function opcionesDeVocal(semilla: number): Vocal[] {
  return barajar(VOCALES, semilla);
}

/** Rondas de letras: cada vuelta recorre las cinco barajadas. */
export function rondasDeVocales(total: number, semilla: number): Vocal[] {
  const rondas: Vocal[] = [];
  let vuelta = 0;
  while (rondas.length < total) {
    for (const vocal of barajar(VOCALES, semilla + vuelta)) {
      rondas.push(vocal);
      if (rondas.length >= total) break;
    }
    vuelta += 1;
  }
  return rondas;
}

/**
 * Rondas de palabra -> vocal inicial. Con 20 palabras y total 20 cada una
 * aparece una vez; si se pide mas, se vuelve a barajar.
 */
export function rondasDePalabrasVocales(
  palabras: readonly PalabraVocal[],
  total: number,
  semilla: number
): RondaPalabraVocal[] {
  if (palabras.length === 0) return [];
  const objetivos: PalabraVocal[] = [];
  let vuelta = 0;
  while (objetivos.length < total) {
    for (const palabra of barajar(palabras, semilla + vuelta)) {
      objetivos.push(palabra);
      if (objetivos.length >= total) break;
    }
    vuelta += 1;
  }

  return objetivos.map((objetivo, indice) => ({
    objetivo,
    opciones: opcionesDeVocal(semilla + indice * 3 + 1),
  }));
}
