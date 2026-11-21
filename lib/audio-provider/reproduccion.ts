import type { Palabra } from "@/lib/palabras";
import { claveAudioPalabra } from "@/lib/palabras";
import { claveSilaba } from "./manifest";
import type { ProveedorEstatico } from "./proveedorEstatico";

const PAUSA_ENTRE_SILABAS_MS = 30;

export function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/**
 * Reproduce una palabra grabada. Nunca se construye uniendo silabas:
 * si falta la grabacion completa, la palabra no se ofrece.
 */
export async function reproducirPalabra(
  proveedor: ProveedorEstatico,
  palabra: Palabra
): Promise<void> {
  const clave = claveAudioPalabra(palabra);
  if (proveedor.disponible(clave)) {
    await proveedor.play(clave);
  }
}

export async function reproducirSilabas(
  proveedor: ProveedorEstatico,
  fonema: string,
  silabas: readonly string[]
): Promise<void> {
  for (const silaba of silabas) {
    await proveedor.play(claveSilaba(fonema, silaba));
    await esperar(PAUSA_ENTRE_SILABAS_MS);
  }
}

export function reproducirSilaba(
  proveedor: ProveedorEstatico,
  fonema: string,
  silaba: string
): void {
  void proveedor.play(claveSilaba(fonema, silaba));
}
