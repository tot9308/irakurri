export type Item = {
  id?: string;
  phoneme: string;
  level: string;
  type: "presentation" | "syllable" | "word" | "inverse" | "cluster" | "review";
  grapheme: string;
  audio_key?: string | null;
  audio_source?: "tts" | "human" | "placeholder";
  image_key?: string | null;
  reviewed_at?: string | null;
  phonological_tags?: string[];
  distractor_pool?: unknown[];
};

// Catalogo en memoria para el modo invitado (F0).
// En produccion este catalogo se lee desde Supabase; aqui esta la version estatica
// sincronizada con supabase/seed/items.json.
export const CATALOGUE_N1: Item[] = [
  { phoneme: "m", level: "N1", type: "presentation", grapheme: "m" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "ma", audio_key: "m/ma", audio_source: "human" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "me", audio_key: "m/me", audio_source: "human" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mi", audio_key: "m/mi", audio_source: "human" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mo", audio_key: "m/mo", audio_source: "human" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mu", audio_key: "m/mu", audio_source: "human" },
  { phoneme: "k", level: "N1", type: "presentation", grapheme: "k" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ka" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ke" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ki" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ko" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ku" },
  { phoneme: "t", level: "N1", type: "presentation", grapheme: "t" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "ta" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "te" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "ti" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "to" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "tu" },
  { phoneme: "l", level: "N1", type: "presentation", grapheme: "l" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "la" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "le" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "li" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "lo" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "lu" },
  { phoneme: "b", level: "N1", type: "presentation", grapheme: "b" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "ba" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "be" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bi" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bo" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bu" },
  { phoneme: "p", level: "N1", type: "presentation", grapheme: "p" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pa" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pe" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pi" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "po" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pu" },
  { phoneme: "d", level: "N1", type: "presentation", grapheme: "d" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "da" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "de" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "di" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "do" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "du" },
];

export function itemsByPhoneme(phoneme: string): Item[] {
  return CATALOGUE_N1.filter((i) => i.phoneme === phoneme);
}

export function allPhonemes(): string[] {
  return [...new Set(CATALOGUE_N1.map((i) => i.phoneme))];
}
