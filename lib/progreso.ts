/**
 * Progreso anonimo del modo invitado en localStorage.
 * Sin datos personales, sin notas ni rankings (regla del proyecto).
 * Clave versionada para poder migrar el formato sin romper sesiones antiguas.
 */

export interface ProgresoFonema {
  secuenciaCompletada: boolean;
  palabrasCompletadas: string[];
  pasosCompletados: string[];
}

export type Progreso = Record<string, ProgresoFonema>;

export const CLAVE_PROGRESO = "irakurri:invitado:v1";

type Almacen = Pick<Storage, "getItem" | "setItem">;

function almacenPorDefecto(): Almacen | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // Navegacion privada o storage bloqueado por el usuario.
    return null;
  }
}

const VACIO: ProgresoFonema = {
  secuenciaCompletada: false,
  palabrasCompletadas: [],
  pasosCompletados: [],
};

/** Lee y sanea el progreso: un JSON corrupto nunca rompe la app. */
export function leerProgreso(almacen: Almacen | null = almacenPorDefecto()): Progreso {
  if (!almacen) return {};
  try {
    const bruto = almacen.getItem(CLAVE_PROGRESO);
    if (!bruto) return {};
    const datos: unknown = JSON.parse(bruto);
    if (typeof datos !== "object" || datos === null) return {};

    const resultado: Progreso = {};
    for (const [fonema, valor] of Object.entries(datos as Record<string, unknown>)) {
      if (typeof valor !== "object" || valor === null) continue;
      const registro = valor as Record<string, unknown>;
      resultado[fonema] = {
        secuenciaCompletada: registro.secuenciaCompletada === true,
        palabrasCompletadas: Array.isArray(registro.palabrasCompletadas)
          ? registro.palabrasCompletadas.filter((p): p is string => typeof p === "string")
          : [],
        pasosCompletados: Array.isArray(registro.pasosCompletados)
          ? registro.pasosCompletados.filter((p): p is string => typeof p === "string")
          : [],
      };
    }
    return resultado;
  } catch {
    return {};
  }
}

/** Guarda el progreso; ignora cuota llena o storage no disponible. */
export function guardarProgreso(
  progreso: Progreso,
  almacen: Almacen | null = almacenPorDefecto()
): void {
  if (!almacen) return;
  try {
    almacen.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
  } catch {
    /* cuota llena o modo privado: el progreso simplemente no persiste */
  }
}

function actualizar(
  fonema: string,
  transformar: (actual: ProgresoFonema) => ProgresoFonema,
  almacen: Almacen | null
): Progreso {
  const progreso = leerProgreso(almacen);
  progreso[fonema] = transformar(progreso[fonema] ?? VACIO);
  guardarProgreso(progreso, almacen);
  return progreso;
}

export function marcarSecuenciaCompletada(
  fonema: string,
  almacen: Almacen | null = almacenPorDefecto()
): Progreso {
  return actualizar(fonema, (actual) => ({ ...actual, secuenciaCompletada: true }), almacen);
}

export function marcarPalabraCompletada(
  fonema: string,
  palabra: string,
  almacen: Almacen | null = almacenPorDefecto()
): Progreso {
  return actualizar(
    fonema,
    (actual) =>
      actual.palabrasCompletadas.includes(palabra)
        ? actual
        : { ...actual, palabrasCompletadas: [...actual.palabrasCompletadas, palabra] },
    almacen
  );
}

export function marcarPasoCompletado(
  fonema: string,
  paso: string,
  almacen: Almacen | null = almacenPorDefecto()
): Progreso {
  return actualizar(
    fonema,
    (actual) =>
      actual.pasosCompletados.includes(paso)
        ? actual
        : { ...actual, pasosCompletados: [...actual.pasosCompletados, paso] },
    almacen
  );
}

export function pasosDeFonema(
  fonema: string,
  almacen: Almacen | null = almacenPorDefecto()
): string[] {
  return leerProgreso(almacen)[fonema]?.pasosCompletados ?? [];
}

/** Mapa fonema -> completado, para pintar el estado en el selector. */
export function fonemasCompletados(
  almacen: Almacen | null = almacenPorDefecto()
): Record<string, boolean> {
  const progreso = leerProgreso(almacen);
  return Object.fromEntries(
    Object.entries(progreso).map(([fonema, valor]) => [fonema, valor.secuenciaCompletada])
  );
}
