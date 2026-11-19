/**
 * Manifest de audio estatico (nunca TTS en runtime).
 * Las duraciones estan medidas con ffprobe sobre los archivos reales.
 * Al regrabar: subir VERSION_AUDIO a "v2" y actualizar duraciones.
 */

export const VERSION_AUDIO = "v1";

/** clave (fonema/grafo) -> duracion real en ms */
export const DURACIONES_MS: Record<string, number> = {
  "m/m": 222,
  "m/meloi": 498,
  "m/musu": 525,
  "m/mamua": 608,
  "m/umea": 509,
  "m/mimo": 470,
  "m/ama": 394,
  "m/amama": 517,
  "m/momia": 531,
  "m/ma": 322,
  "m/me": 333,
  "m/mi": 359,
  "m/mo": 328,
  "m/mu": 353,
  "vocales/a": 241,
  "vocales/e": 296,
  "vocales/i": 263,
  "vocales/o": 255,
  "vocales/u": 282,
  "pseudohitzak/memi": 441,
  "pseudohitzak/mimu": 516,
  "pseudohitzak/mumo": 579,
  "pseudohitzak/moma": 445,
  "pseudohitzak/memu": 547,
  "pseudohitzak/mume": 547,
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

/** Fonemas que ya tienen algun audio grabado (excluye carpetas compartidas). */
export function fonemasConAudio(): string[] {
  const compartidas = new Set(["vocales", "pseudohitzak"]);
  const fonemas = new Set<string>();
  for (const clave of Object.keys(DURACIONES_MS)) {
    const [primero] = clave.split("/");
    if (primero && !compartidas.has(primero)) fonemas.add(primero);
  }
  return [...fonemas];
}
