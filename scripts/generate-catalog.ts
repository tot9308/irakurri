/**
 * scripts/generate-catalog.ts
 * Genera supabase/seed/items.json a partir de la progresión de fonemas.
 *
 * Regla del catálogo: una palabra/página solo entra en el nivel de un fonema
 * si TODAS sus sílabas directas usan fonemas ya trabajados hasta ese punto.
 *
 * Uso: node scripts/generate-catalog.ts
 * Salida: supabase/seed/items.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Orden didáctico de fonemas (M, K, T, L, B, P, D, N, ...)
const PHONEME_ORDER: Record<string, number> = {
  m: 0,
  k: 1,
  t: 2,
  l: 3,
  b: 4,
  p: 5,
  d: 6,
  n: 7,
  f: 8,
  g: 9,
  r: 10,
  rr: 11,
  j: 12,
  s: 13,
  x: 14,
  z: 15,
  ts: 16,
  tx: 17,
  tz: 18
};

// Fonemas N1 (sílabas directas CV)
const N1_PHONEMES = ["m", "k", "t", "l", "b", "p", "d", "n", "f", "g", "r", "rr", "j", "s", "x", "z"];
// Niveles posteriores
const N4_PHONEMES = ["ts", "tx", "tz"];

type Item = {
  phoneme: string;
  level: string;
  type: string;
  grapheme: string;
  audio_key: string | null;
  audio_source: string;
  image_key: string | null;
  reviewed_at: string | null;
};

// Genera sílabas CV para un fonema: [fonema + vocal, ...]
function syllablesFor(phoneme: string, vowels: string[]): string[] {
  return vowels.map((v) => phoneme + v);
}

// Palabras de 2 sílabas: usamos solo fonemas ya trabajados (orden)
function generateWords(fonemes: string[], minFonemes: number): string[] {
  const result: string[] = [];
  if (fonemes.length < minFonemes) return result;
  for (let i = 0; i < fonemes.length; i++) {
    for (let j = 0; j < fonemes.length; j++) {
      if (i !== j) {
        const w = fonemes[i] + fonemes[j];
        // Evitar duplicados y palabras no atestiguadas (se filtran en revisión)
        if (!result.includes(w) && w.length === 2) {
          result.push(w);
        }
      }
    }
  }
  return result;
}

const vowels = ["a", "e", "i", "o", "u"];

function main() {
  const items: Item[] = [];
  let idx = 0;

  // 1. Presentaciones de fonema
  for (const p of N1_PHONEMES) {
    items.push({
      phoneme: p,
      level: "N1",
      type: "presentation",
      grapheme: p,
      audio_key: null,
      audio_source: "placeholder",
      image_key: null,
      reviewed_at: null
    });
    idx++;
  }

  // 2. Sílabas CV (20 por fonema)
  for (const p of N1_PHONEMES) {
    const syls = syllablesFor(p, vowels);
    // Solo 20 sílabas por fonema (se priorizan las más frecuentes)
    for (let i = 0; i < 20 && i < syls.length; i++) {
      items.push({
        phoneme: p,
        level: "N1",
        type: "syllable",
        grapheme: syls[i]!,
        audio_key: null,
        audio_source: "placeholder",
        image_key: null,
        reviewed_at: null
      });
      idx++;
    }
  }

  // 3. Palabras de 2 sílabas (cuando haya 5 fonemas trabajados)
  const words = generateWords(N1_PHONEMES, 5);
  for (const w of words.slice(0, 40)) {
    items.push({
      phoneme: "m", // fonema principal (se puede indicar el primero)
      level: "N1",
      type: "word",
      grapheme: w,
      audio_key: null,
      audio_source: "placeholder",
      image_key: null,
      reviewed_at: null
    });
    idx++;
  }

  // 4. Sílabas N4 (africadas)
  for (const p of N4_PHONEMES) {
    const syls = syllablesFor(p, vowels);
    for (let i = 0; i < 5 && i < syls.length; i++) {
      items.push({
        phoneme: p,
        level: "N4",
        type: "syllable",
        grapheme: syls[i]!,
        audio_key: null,
        audio_source: "placeholder",
        image_key: null,
        reviewed_at: null
      });
      idx++;
    }
  }

  const output = {
    version: "0.1.0",
    description: "Catálogo de ítems para el modo invitado (F0). Versión inicial: N1 (sílabas directas CV).",
    items
  };

  const outPath = join(__dirname, "..", "supabase", "seed", "items.json");
  mkdirSync(join(__dirname, "..", "supabase", "seed"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`✅ Generated ${output.items.length} items in ${outPath}`);
}

main();
