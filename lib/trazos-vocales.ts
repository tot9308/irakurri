import type { Vocal } from "@/lib/vocales";

/**
 * Trazos de las vocales en minuscula, en un lienzo de 100 x 100.
 * El orden del array es el orden de escritura; `inicio` marca donde
 * arranca cada trazo para poder numerarlo.
 */
export interface TrazoVocal {
  d: string;
  inicio: { x: number; y: number };
  /** Posicion del numero de orden; si falta, se usa `inicio`. */
  numero?: { x: number; y: number };
  duracionMs: number;
}

export const TRAZOS_VOCALES: Record<Vocal, readonly TrazoVocal[]> = {
  a: [
    {
      d: "M 68 34 C 58 24 42 22 30 34 C 18 47 20 68 34 78 C 48 88 64 80 70 66",
      inicio: { x: 68, y: 34 },
      numero: { x: 58, y: 22 },
      duracionMs: 1100,
    },
    {
      d: "M 70 28 L 70 80",
      inicio: { x: 70, y: 28 },
      numero: { x: 84, y: 30 },
      duracionMs: 500,
    },
  ],
  e: [
    {
      d: "M 24 55 L 72 55 C 72 38 62 26 47 26 C 30 26 22 40 22 55 C 22 71 34 82 50 82 C 60 82 68 77 72 70",
      inicio: { x: 24, y: 55 },
      numero: { x: 14, y: 46 },
      duracionMs: 1600,
    },
  ],
  i: [
    {
      d: "M 50 32 L 50 80",
      inicio: { x: 50, y: 32 },
      numero: { x: 62, y: 36 },
      duracionMs: 700,
    },
    {
      d: "M 50 18 L 50 20",
      inicio: { x: 50, y: 18 },
      numero: { x: 50, y: 8 },
      duracionMs: 220,
    },
  ],
  o: [
    {
      d: "M 50 24 C 32 24 20 38 20 54 C 20 70 32 82 50 82 C 68 82 80 70 80 54 C 80 38 68 24 50 24",
      inicio: { x: 50, y: 24 },
      numero: { x: 50, y: 12 },
      duracionMs: 1500,
    },
  ],
  u: [
    {
      d: "M 26 28 L 26 58 C 26 72 36 82 50 82 C 64 82 74 72 74 58 L 74 28",
      inicio: { x: 26, y: 28 },
      numero: { x: 16, y: 18 },
      duracionMs: 1400,
    },
  ],
};
