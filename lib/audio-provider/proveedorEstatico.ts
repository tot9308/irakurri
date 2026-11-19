import type { AudioProvider, AudioStatus } from "./audio-provider";
import { DURACIONES_MS, duracionAudio, rutaAudio } from "./manifest";

/** Margen maximo de espera para el evento "ended" (por si el navegador no lo emite). */
const MARGEN_FIN_MS = 800;

/**
 * Proveedor de audio estatico para el modo invitado.
 * Un HTMLAudioElement por clave, creado una vez y reutilizado (clave en Android:
 * crear `new Audio()` en cada reproduccion anade 50-200 ms y descuadra el ritmo).
 */
export class ProveedorEstatico implements AudioProvider {
  readonly name = "Estatico";
  readonly status: AudioStatus = "eu-real";

  private elementos = new Map<string, HTMLAudioElement>();
  private activo: HTMLAudioElement | null = null;

  disponible(clave: string): boolean {
    return clave in DURACIONES_MS;
  }

  isAvailable(): boolean {
    return this.hayArchivosDeclarados();
  }

  precargar(claves: string[]): void {
    claves.forEach((clave) => this.elemento(clave));
  }

  /** Resuelve cuando el audio termina (o falla), para encadenar la secuencia. */
  async play(clave: string): Promise<void> {
    const elemento = this.elemento(clave);
    if (!elemento) return;

    this.stop();
    this.activo = elemento;

    try {
      elemento.currentTime = 0;
    } catch {
      /* currentTime falla si aun no hay metadatos; el play lo resolvera */
    }

    await new Promise<void>((resolver) => {
      let resuelto = false;
      const terminar = () => {
        if (resuelto) return;
        resuelto = true;
        elemento.removeEventListener("ended", terminar);
        elemento.removeEventListener("error", terminar);
        elemento.removeEventListener("pause", terminar);
        clearTimeout(limite);
        resolver();
      };
      const limite = setTimeout(
        terminar,
        Math.max(
          duracionAudio(clave),
          Number.isFinite(elemento.duration) ? elemento.duration * 1000 : 0
        ) + MARGEN_FIN_MS
      );

      elemento.addEventListener("ended", terminar);
      elemento.addEventListener("error", terminar);
      elemento.addEventListener("pause", terminar);

      const reproduccion = elemento.play();
      if (reproduccion && typeof reproduccion.catch === "function") {
        reproduccion.catch(terminar);
      }
    });

    if (this.activo === elemento) this.activo = null;
  }

  stop(): void {
    if (!this.activo) return;
    const elemento = this.activo;
    this.activo = null;
    elemento.pause();
    try {
      elemento.currentTime = 0;
    } catch {
      /* ignorado: el elemento puede estar sin metadatos */
    }
  }

  private hayArchivosDeclarados(): boolean {
    return Object.keys(DURACIONES_MS).length > 0;
  }

  private elemento(clave: string): HTMLAudioElement | null {
    if (typeof window === "undefined" || typeof Audio === "undefined") return null;
    if (!this.disponible(clave)) return null;

    const existente = this.elementos.get(clave);
    if (existente) return existente;

    const audio = new Audio(rutaAudio(clave));
    audio.preload = "auto";
    audio.volume = 1;
    this.elementos.set(clave, audio);
    return audio;
  }
}
