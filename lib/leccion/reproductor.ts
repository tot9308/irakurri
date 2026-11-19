/** Pausa entre elementos de una practica (despues de que termine el audio). */
export const PAUSA_PRACTICA_BASE_MS = 900;
export const PAUSA_PRACTICA_MINIMA_MS = 250;

/**
 * La velocidad solo cambia el silencio entre elementos; el audio nunca se
 * ralentiza para no distorsionar el modelo fonologico.
 */
export function pausaPractica(
  velocidad: number,
  baseMs: number = PAUSA_PRACTICA_BASE_MS
): number {
  const v = velocidad > 0 ? velocidad : 1;
  return Math.max(PAUSA_PRACTICA_MINIMA_MS, Math.round(baseMs / v));
}
