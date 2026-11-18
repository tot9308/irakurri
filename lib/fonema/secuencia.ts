/**
 * Logica pura de la secuencia de silabas (sin DOM, sin React): testeable con Vitest.
 * La velocidad afecta solo a la pausa entre silabas; el audio nunca se ralentiza
 * (playbackRate siempre 1) porque distorsiona el modelo fonologico.
 */

export const VOCALES = ["a", "e", "i", "o", "u"] as const;

export const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5] as const;
export type Velocidad = (typeof VELOCIDADES)[number];

export const PAUSA_BASE_MS = 700;
export const PAUSA_MINIMA_MS = 180;
export const INTERVALO_RESPALDO_MS = 1100;

export type Fase = "inactivo" | "presentando" | "pausado" | "completado";
export type EstadoFicha = "oculta" | "activa" | "atenuada" | "completa";

/** Pausa entre el final de un audio y la siguiente silaba. */
export function pausaEntreSilabas(velocidad: number): number {
  const v = velocidad > 0 ? velocidad : 1;
  return Math.max(PAUSA_MINIMA_MS, Math.round(PAUSA_BASE_MS / v));
}

/** Intervalo cuando no hay audio disponible (placeholder): simula la pronunciacion. */
export function intervaloRespaldo(velocidad: number): number {
  const v = velocidad > 0 ? velocidad : 1;
  return Math.max(PAUSA_MINIMA_MS, Math.round(INTERVALO_RESPALDO_MS / v));
}

/** Intervalo total entre inicios de silaba (audio + pausa). */
export function intervaloSilaba(velocidad: number, duracionMs: number): number {
  return duracionMs + pausaEntreSilabas(velocidad);
}

function posicionVocal(silaba: string, fonema: string): number {
  const vocal = silaba.slice(fonema.length);
  const indice = VOCALES.indexOf(vocal as (typeof VOCALES)[number]);
  return indice === -1 ? VOCALES.length : indice;
}

/** Construye la secuencia ordenada a-e-i-o-u a partir de las silabas del catalogo. */
export function construirSecuencia(
  fonema: string,
  silabas: readonly string[]
): string[] {
  return silabas
    .filter((s) => s.startsWith(fonema) && s.length > fonema.length)
    .sort((a, b) => posicionVocal(a, fonema) - posicionVocal(b, fonema));
}

/** Cuantas fichas estan visibles en el Stage segun la fase. */
export function mostradas(fase: Fase, indice: number, total: number): number {
  if (fase === "inactivo") return 0;
  if (fase === "completado") return total;
  return Math.min(total, indice + 1);
}

export function estadoFicha(
  fase: Fase,
  indice: number,
  posicion: number,
  total: number
): EstadoFicha {
  if (fase === "inactivo") return "oculta";
  if (posicion >= mostradas(fase, indice, total)) return "oculta";
  if (fase === "completado") return "completa";
  return posicion === indice ? "activa" : "atenuada";
}

/** Siguiente paso: si ya estaba en la ultima, la secuencia queda completada. */
export function siguientePaso(
  indice: number,
  total: number
): { indice: number; completado: boolean } {
  if (indice + 1 >= total) return { indice, completado: true };
  return { indice: indice + 1, completado: false };
}
