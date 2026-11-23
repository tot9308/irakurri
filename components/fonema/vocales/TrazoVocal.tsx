"use client";

import { TRAZOS_VOCALES } from "@/lib/trazos-vocales";
import type { Vocal } from "@/lib/vocales";

interface TrazoVocalProps {
  vocal: Vocal;
  modo?: "animado" | "guia";
  /** Cambia este valor para reiniciar la animacion. */
  repeticion?: number;
  className?: string;
}

/**
 * Letra dibujada por trazos, con el orden de escritura numerado.
 * En modo guia se muestra punteada y sin animacion, para calcar encima.
 */
export function TrazoVocal({
  vocal,
  modo = "animado",
  repeticion = 0,
  className,
}: TrazoVocalProps) {
  const trazos = TRAZOS_VOCALES[vocal];
  let acumulado = 0;
  const dibujos = trazos.map((trazo) => {
    const retraso = acumulado;
    acumulado += trazo.duracionMs + (modo === "animado" ? 260 : 0);
    return { ...trazo, retraso };
  });
  const duracionTotal = acumulado;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${vocal} letraren trazoa`}
      className={className}
    >
      {dibujos.map((trazo, indice) => (
        <path
          key={`${repeticion}-trazo-${indice}`}
          d={trazo.d}
          pathLength={modo === "animado" ? 1 : undefined}
          fill="none"
          stroke={modo === "guia" ? "#d4d4d8" : "#0369a1"}
          strokeWidth={modo === "guia" ? 12 : 10}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={modo === "animado" ? "1 1" : undefined}
          strokeDashoffset={modo === "animado" ? 1 : 0}
          className={modo === "animado" ? "trazo-letra-animado" : undefined}
          style={
            modo === "animado"
              ? {
                  animation: `dibujar-letra ${trazo.duracionMs}ms ease forwards`,
                  animationDelay: `${trazo.retraso}ms`,
                }
              : undefined
          }
        />
      ))}

      {modo === "animado" &&
        dibujos.map((trazo, indice) => {
          const posicion = trazo.numero ?? trazo.inicio;
          return (
            <g
              key={`${repeticion}-inicio-${indice}`}
              style={{
                animation: `fundido-numero 400ms ease ${duracionTotal + 250}ms forwards`,
              }}
            >
              <circle
                cx={posicion.x}
                cy={posicion.y}
                r={6}
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth={2}
              />
              <text
                x={posicion.x}
                y={posicion.y + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={6.5}
                fontWeight={800}
                fill="#0369a1"
              >
                {indice + 1}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
