/**
 * Manifest de audio estatico (nunca TTS en runtime).
 * Las duraciones estan medidas con ffprobe sobre los archivos reales.
 * Al regrabar: subir VERSION_AUDIO a "v2" y actualizar duraciones.
 */

export const VERSION_AUDIO = "v1";

/** clave (fonema/grafo) -> duracion real en ms */
export const DURACIONES_MS: Record<string, number> = {
  "m/m": 624,
  "m/ma": 456,
  "m/me": 504,
  "m/mi": 456,
  "m/mo": 528,
  "m/mu": 576,
  "vocales/a": 432,
  "vocales/e": 480,
  "vocales/i": 432,
  "vocales/o": 432,
  "vocales/u": 456,
};

/** Fonemas con audio aislado grabado. */
export const FONEMAS_CON_AUDIO_AISLADO: ReadonlySet<string> = new Set(["m"]);

const VOCALES = new Set(["a", "e", "i", "o", "u"]);

export function claveAudio(fonema: string, grafo: string): string {
  return `${fonema}/${grafo}`;
}

/**
 * Clave de una silaba suelta: las vocales se comparten entre fonemas
 * (public/audio/v1/vocales/a.mp3), las CV van por fonema (m/ma).
 */
export function claveSilaba(fonema: string, silaba: string): string {
  return VOCALES.has(silaba) ? `vocales/${silaba}` : `${fonema}/${silaba}`;
}

export function rutaAudio(clave: string): string {
  return `/audio/${VERSION_AUDIO}/${clave}.mp3`;
}

export function duracionAudio(clave: string): number {
  return DURACIONES_MS[clave] ?? 300;
}

export function clavesDisponibles(): string[] {
  return Object.keys(DURACIONES_MS);
}

/** Fonemas que ya tienen algun audio grabado (excluye la carpeta compartida de vocales). */
export function fonemasConAudio(): string[] {
  const fonemas = new Set<string>();
  for (const clave of Object.keys(DURACIONES_MS)) {
    const [primero] = clave.split("/");
    if (primero && primero !== "vocales") fonemas.add(primero);
  }
  return [...fonemas];
}
