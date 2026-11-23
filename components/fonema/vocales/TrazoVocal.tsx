"use client";

import type { Vocal } from "@/lib/vocales";

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
 * Letra real de Edelfontmed, en minuscula o mayuscula.
 * La animacion revela el glifo de izquierda a derecha; la guia muestra
 * el mismo glifo en gris para repasarlo encima.
 */
export function TrazoVocal({
  vocal,
  caso = "minuscula",
  modo = "animado",
  repeticion = 0,
  className,
}: TrazoVocalProps) {
  const letra = caso === "mayuscula" ? vocal.toUpperCase() : vocal;
  const id = `trazo-${vocal}-${caso}-${repeticion}`;
  const tamano = caso === "mayuscula" ? 110 : 150;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${letra} letraren trazoa`}
      className={className}
    >
      <defs>
        <clipPath id={id} key={id}>
          {modo === "animado" ? (
            <rect x="0" y="0" width="0" height="100">
              <animate
                attributeName="width"
                from="0"
                to="100"
                dur="1.4s"
                fill="freeze"
              />
            </rect>
          ) : (
            <rect x="0" y="0" width="100" height="100" />
          )}
        </clipPath>
      </defs>
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontFamily="Edelfontmed, 'Comic Sans MS', 'Segoe Print', system-ui, sans-serif"
        fontSize={tamano}
        fontWeight={400}
        fill={modo === "guia" ? "#d4d4d8" : "#0369a1"}
        clipPath={`url(#${id})`}
      >
        {letra}
      </text>
    </svg>
  );
}
