import { describe, it, expect, beforeEach } from "vitest";
import {
  CLAVE_PROGRESO,
  fonemasCompletados,
  guardarProgreso,
  leerProgreso,
  marcarPalabraCompletada,
  marcarSecuenciaCompletada,
} from "@/lib/progreso";

type AlmacenFalso = Pick<Storage, "getItem" | "setItem"> & {
  datos: Map<string, string>;
  fallarAlGuardar: boolean;
};

function crearAlmacen(): AlmacenFalso {
  const datos = new Map<string, string>();
  return {
    datos,
    fallarAlGuardar: false,
    getItem(clave: string) {
      return datos.has(clave) ? (datos.get(clave) as string) : null;
    },
    setItem(clave: string, valor: string) {
      if (this.fallarAlGuardar) throw new Error("QuotaExceededError");
      datos.set(clave, valor);
    },
  };
}

let almacen: AlmacenFalso;

beforeEach(() => {
  almacen = crearAlmacen();
});

describe("progreso", () => {
  it("empieza vacio", () => {
    expect(leerProgreso(almacen)).toEqual({});
    expect(fonemasCompletados(almacen)).toEqual({});
  });

  it("marca la secuencia de un fonema sin tocar los demas", () => {
    marcarSecuenciaCompletada("m", almacen);
    expect(leerProgreso(almacen).m.secuenciaCompletada).toBe(true);
    expect(leerProgreso(almacen).k).toBeUndefined();
    expect(fonemasCompletados(almacen)).toEqual({ m: true });
  });

  it("no duplica palabras completadas", () => {
    marcarPalabraCompletada("m", "mamu", almacen);
    marcarPalabraCompletada("m", "mamu", almacen);
    marcarPalabraCompletada("m", "mami", almacen);
    expect(leerProgreso(almacen).m.palabrasCompletadas).toEqual(["mamu", "mami"]);
  });

  it("no rompe con JSON corrupto", () => {
    almacen.datos.set(CLAVE_PROGRESO, "{no-es-json");
    expect(leerProgreso(almacen)).toEqual({});
  });

  it("descarta registros con forma invalida", () => {
    almacen.datos.set(
      CLAVE_PROGRESO,
      JSON.stringify({ m: { secuenciaCompletada: "si", palabrasCompletadas: [1, "mamu"] }, k: null })
    );
    const progreso = leerProgreso(almacen);
    expect(progreso.m).toEqual({ secuenciaCompletada: false, palabrasCompletadas: ["mamu"] });
    expect(progreso.k).toBeUndefined();
  });

  it("no propaga errores de cuota al guardar", () => {
    almacen.fallarAlGuardar = true;
    expect(() => guardarProgreso({ m: { secuenciaCompletada: true, palabrasCompletadas: [] } }, almacen)).not.toThrow();
    expect(leerProgreso(almacen)).toEqual({});
  });

  it("funciona sin almacen (SSR)", () => {
    expect(leerProgreso(null)).toEqual({});
    expect(() => marcarSecuenciaCompletada("m", null)).not.toThrow();
    expect(fonemasCompletados(null)).toEqual({});
  });
});
