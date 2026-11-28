"use client";

import { useEffect, useRef, useState } from "react";
import {
  GLIFOS_EDELFONTMED,
  type LetraEdelfontmed,
} from "@/lib/glifos-edelfontmed";
import { PASOS_TRAZO_VOCALES } from "@/lib/pasos-trazo-vocales";

const COLORES = ["#2563eb", "#f59e0b", "#7c3aed", "#0891b2"];
const COLOR_INICIO = "#16a34a";

interface Flecha {
  x: number;
  y: number;
  angulo: number;
}

interface Inicio {
  x: number;
  y: number;
}

interface DiagramaTrazoProps {
  letra: LetraEdelfontmed;
  /** Paso resaltado (1-based). Si no se indica, se ven todos. */
  pasoActivo?: number;
  /** Para la pizarra: guia tenue detras del dedo. */
  atenuado?: boolean;
  className?: string;
  mostrarNumeros?: boolean;
}

/**
 * Diagrama estatico de trazo: glifo real en gris, pasos numerados y flechas.
 * No depende de una animacion, asi que el nino puede mirarlo sin prisa.
 */
export function DiagramaTrazo({
  letra,
  pasoActivo,
  atenuado = false,
  className,
  mostrarNumeros = true,
}: DiagramaTrazoProps) {
  const pasos = PASOS_TRAZO_VOCALES[letra];
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [flechas, setFlechas] = useState<Flecha[][]>([]);
  const [numeros, setNumeros] = useState<Inicio[]>([]);

  useEffect(() => {
    const elementos = refs.current.slice(0, pasos.length);
    const nuevasFlechas = elementos.map((elemento) => {
      const longitud = elemento?.getTotalLength() ?? 0;
      if (!elemento || longitud < 8) return [];
      const cantidad = Math.max(1, Math.min(3, Math.round(longitud / 95)));
      return Array.from({ length: cantidad }, (_, indice) => {
        const fraccion = (indice + 1) / (cantidad + 1);
        const distancia = fraccion * longitud;
        const punto = elemento.getPointAtLength(distancia);
        const anterior = elemento.getPointAtLength(Math.max(0, distancia - 2));
        const siguiente = elemento.getPointAtLength(
          Math.min(longitud, distancia + 2)
        );
        return {
          x: punto.x,
          y: punto.y,
          angulo:
            (Math.atan2(siguiente.y - anterior.y, siguiente.x - anterior.x) *
              180) /
            Math.PI,
        };
      });
    });
    const nuevosInicios = elementos.map((elemento) => {
      const punto = elemento?.getPointAtLength(0);
      return { x: punto?.x ?? 50, y: punto?.y ?? 50 };
    });
    const nuevosNumeros = nuevosInicios.map((inicio, indice) => {
      if (indice === 0) return inicio;
      const elemento = elementos[indice];
      const longitud = elemento?.getTotalLength() ?? 0;
      if (elemento && longitud > 8) {
        const punto = elemento.getPointAtLength(longitud * 0.18);
        return { x: punto.x, y: punto.y };
      }
      return inicio;
    });
    setFlechas(nuevasFlechas);
    setNumeros(nuevosNumeros);
  }, [letra, pasos]);

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${letra} letraren trazo urratsak`}
      data-testid="diagrama-trazo"
      className={className}
    >
      <path d={GLIFOS_EDELFONTMED[letra]} fill="#e5e7eb" />

      {pasos.map((trazo, indice) => {
        const numero = indice + 1;
        const activo = pasoActivo === undefined || pasoActivo === numero;
        const color = COLORES[indice % COLORES.length];
        const opacidad = atenuado ? 0.3 : activo ? 1 : 0.6;
        const numeroPosicion = numeros[indice];

        return (
          <g
            key={`${letra}-${numero}`}
            data-testid={`trazo-paso-${numero}`}
            opacity={opacidad}
          >
            <path
              ref={(elemento) => {
                refs.current[indice] = elemento;
              }}
              d={trazo}
              fill="none"
              stroke={color}
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {flechas[indice]?.map((flecha, posicion) => (
              <polygon
                key={`flecha-${numero}-${posicion}`}
                points="-2.8,-2.8 5,0 -2.8,2.8"
                fill={color}
                transform={`translate(${flecha.x} ${flecha.y}) rotate(${flecha.angulo})`}
              />
            ))}

            {mostrarNumeros && numeroPosicion && (
              <g
                opacity={activo ? 1 : 0.75}
                transform={`translate(${numeroPosicion.x} ${numeroPosicion.y - 7})`}
              >
                <circle
                  r={5.5}
                  fill={numero === 1 ? COLOR_INICIO : color}
                  stroke="#ffffff"
                  strokeWidth={1.3}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={7}
                  fontWeight="700"
                  fill="#ffffff"
                >
                  {numero}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
