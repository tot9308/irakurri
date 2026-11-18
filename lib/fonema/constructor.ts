/**
 * Logica pura del constructor de palabras (sin DOM, sin React).
 * El objetivo nunca se muestra escrito: se oye (imagen + audio).
 */

export type FaseConstructor = "construyendo" | "correcto" | "error";

export interface EstadoConstructor {
  colocadas: string[];
  fase: FaseConstructor;
}

export function estadoInicial(): EstadoConstructor {
  return { colocadas: [], fase: "construyendo" };
}

export function esCorrecta(
  colocadas: readonly string[],
  objetivo: readonly string[]
): boolean {
  return (
    colocadas.length === objetivo.length &&
    colocadas.every((silaba, posicion) => silaba === objetivo[posicion])
  );
}

/** Coloca una silaba en el siguiente hueco y evalua al llenar la palabra. */
export function colocar(
  estado: EstadoConstructor,
  silaba: string,
  objetivo: readonly string[]
): EstadoConstructor {
  if (estado.fase === "correcto") return estado;
  if (estado.colocadas.length >= objetivo.length) return estado;

  const colocadas = [...estado.colocadas, silaba];
  if (colocadas.length < objetivo.length) {
    return { colocadas, fase: "construyendo" };
  }
  return {
    colocadas,
    fase: esCorrecta(colocadas, objetivo) ? "correcto" : "error",
  };
}

/** Quita una silaba concreta (no se puede tocar una palabra ya resuelta). */
export function quitar(estado: EstadoConstructor, posicion: number): EstadoConstructor {
  if (estado.fase === "correcto") return estado;
  if (posicion < 0 || posicion >= estado.colocadas.length) return estado;
  return {
    colocadas: estado.colocadas.filter((_, indice) => indice !== posicion),
    fase: "construyendo",
  };
}

export function vaciar(estado: EstadoConstructor): EstadoConstructor {
  if (estado.fase === "correcto") return estado;
  return estadoInicial();
}

/** Tras un error se limpia solo: el criollo puede reintentar sin dead-ends. */
export function limpiarError(estado: EstadoConstructor): EstadoConstructor {
  return estado.fase === "error" ? estadoInicial() : estado;
}
