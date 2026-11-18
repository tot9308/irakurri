import { DURACIONES_MS, claveAudio, claveSilaba } from "@/lib/audio-provider/manifest";

/**
 * Palabras N1 del fonema m, validadas en euskera batua.
 * `silabas` es la descomposicion silabica real (las vocales solas cuentan).
 */
export interface Palabra {
  id: string;
  fonema: string;
  silabas: string[];
}

export const PALABRAS: readonly Palabra[] = [
  { id: "mamua", fonema: "m", silabas: ["ma", "mu", "a"] },
  { id: "umea", fonema: "m", silabas: ["u", "me", "a"] },
  { id: "mimo", fonema: "m", silabas: ["mi", "mo"] },
  { id: "ama", fonema: "m", silabas: ["a", "ma"] },
  { id: "amama", fonema: "m", silabas: ["a", "ma", "ma"] },
  { id: "momia", fonema: "m", silabas: ["mo", "mi", "a"] },
];

/** Extensiones aceptadas para las fotos, en orden de preferencia (hoy son png). */
export const EXTENSIONES_IMAGEN = ["png", "webp", "jpg", "jpeg", "svg"] as const;

export function palabrasDeFonema(fonema: string): Palabra[] {
  return PALABRAS.filter((p) => p.fonema === fonema);
}

export function textoPalabra(palabra: Palabra): string {
  return palabra.silabas.join("");
}

export function rutaImagenPalabra(id: string, extension: string): string {
  return `/img/v1/palabras/${id}.${extension}`;
}

export function claveAudioPalabra(palabra: Palabra): string {
  return claveAudio(palabra.fonema, textoPalabra(palabra));
}

/**
 * Una palabra solo se ofrece si se puede escuchar: grabacion de la palabra
 * completa o, en su defecto, todas sus silabas.
 */
export function palabrasConAudio(fonema: string): Palabra[] {
  return palabrasDeFonema(fonema).filter((palabra) => {
    if (claveAudioPalabra(palabra) in DURACIONES_MS) return true;
    return palabra.silabas.every((silaba) => claveSilaba(palabra.fonema, silaba) in DURACIONES_MS);
  });
}

/** Silabas para el banco: las de la palabra + hasta `maxExtras` distractoras. */
export function bancoDeSilabas(
  objetivo: readonly string[],
  extras: readonly string[] = [],
  maxExtras = 2
): string[] {
  const base = [...new Set(objetivo)];
  const anadidas = extras.filter((s) => !base.includes(s)).slice(0, maxExtras);
  return [...base, ...anadidas];
}
