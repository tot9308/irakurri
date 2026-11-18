"use client";

import { useEffect, useRef } from "react";
import { ProveedorEstatico } from "./proveedorEstatico";

/** Un unico proveedor de audio por pantalla, reutilizado entre pasos. */
export function useProveedorAudio(): ProveedorEstatico {
  const ref = useRef<ProveedorEstatico | null>(null);
  if (ref.current === null) {
    ref.current = new ProveedorEstatico();
  }
  const proveedor = ref.current;

  useEffect(() => () => proveedor.stop(), [proveedor]);

  return proveedor;
}
