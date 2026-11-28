"use client";

import {
  GLIFOS_EDELFONTMED,
  type LetraEdelfontmed,
} from "@/lib/glifos-edelfontmed";
import type { Vocal } from "@/lib/vocales";
import { DiagramaTrazo } from "./DiagramaTrazo";
import { GuiaTrazo } from "./GuiaTrazo";

export type CasoLetra = "minuscula" | "mayuscula";

interface TrazoVocalProps {
  vocal: Vocal;
  caso?: CasoLetra;
  modo?: "pasos" | "animado" | "guia";
  /** Paso resaltado en el diagrama estatico (1-based). */
  pasoActivo?: number;
  atenuado?: boolean;
  /** Cambia este valor para reiniciar la animacion. */
  repeticion?: number;
  className?: string;
}

/**
 * Glifo real de Edelfontmed (minuscula o mayuscula) y, encima, el diagrama
 * de pasos o el circulo rojo de la animacion opcional.
 */
export function TrazoVocal({
  vocal,
  caso = "minuscula",
  modo = "pasos",
  pasoActivo,
  atenuado = false,
  repeticion = 0,
  className,
}: TrazoVocalProps) {
  const letra = (caso === "mayuscula"
    ? vocal.toUpperCase()
    : vocal) as LetraEdelfontmed;

  if (modo !== "animado") {
    return (
      <DiagramaTrazo
        letra={letra}
        pasoActivo={pasoActivo}
        atenuado={atenuado || modo === "guia"}
        mostrarNumeros={modo !== "guia"}
        className={className}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${letra} letraren trazoa`}
      className={className}
    >
      <path d={GLIFOS_EDELFONTMED[letra]} fill="#bae6fd" />
      <GuiaTrazo letra={letra} modo={modo} repeticion={repeticion} />
    </svg>
  );
}
