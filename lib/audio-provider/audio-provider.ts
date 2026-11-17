export type AudioStatus =
  | "eu-real"
  | "es-approximation"
  | "teacher-voice"
  | "none";

export interface AudioProvider {
  /** Nombre del proveedor para logs y UI */
  readonly name: string;
  /** Estado actual del audio */
  readonly status: AudioStatus;
  /** Reproduce el audio asociado a una clave */
  play(key: string): Promise<void>;
  /** Detiene cualquier reproduccion en curso */
  stop(): void;
  /** Indica si el audio esta disponible */
  isAvailable(): boolean;
}

/** Implementacion para desarrollo: sin audio real. */
export class LocalPlaceholder implements AudioProvider {
  readonly name = "LocalPlaceholder";
  readonly status: AudioStatus = "none";

  async play(_key: string): Promise<void> {
    // No-op en desarrollo
  }

  stop(): void {
    // No-op
  }

  isAvailable(): boolean {
    return false;
  }
}
