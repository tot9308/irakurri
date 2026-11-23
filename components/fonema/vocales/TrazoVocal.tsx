"use client";

import {
  GLIFOS_EDELFONTMED,
  type LetraEdelfontmed,
} from "@/lib/glifos-edelfontmed";
import type { Vocal } from "@/lib/vocales";
import { GuiaTrazo } from "./GuiaTrazo";

export type CasoLetra = "minuscula" | "mayuscula";

interface TrazoVocalProps {
  vocal: Vocal;
  caso?: CasoLetra;
  modo?: "animado" | "guia";
  /** Cambia este valor para reiniciar la animacion. */
  repeticion?: number;
  className?: string;
}

/**
 * Glifo real de Edelfontmed (minuscula o mayuscula) y, encima, el circulo
 * rojo que recorre el trazo pedagogico. La letra no es un dibujo aparte:
 * sale de los contornos de la propia fuente.
 */
export function TrazoVocal({
  vocal,
  caso = "minuscula",
  modo = "animado",
  repeticion = 0,
  className,
}: TrazoVocalProps) {
  const letra = (caso === "mayuscula"
    ? vocal.toUpperCase()
    : vocal) as LetraEdelfontmed;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${letra} letraren trazoa`}
      className={className}
    >
      <path
        d={GLIFOS_EDELFONTMED[letra]}
        fill={modo === "guia" ? "#e4e4e7" : "#bae6fd"}
      />
      <GuiaTrazo letra={letra} modo={modo} repeticion={repeticion} />
    </svg>
  );
}
