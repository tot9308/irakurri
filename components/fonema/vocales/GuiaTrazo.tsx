"use client";

import { useEffect, useRef, useState } from "react";
import type { LetraEdelfontmed } from "@/lib/glifos-edelfontmed";
import { RECORRIDOS_VOCALES } from "@/lib/recorridos-vocales";

interface GuiaTrazoProps {
  letra: LetraEdelfontmed;
  modo: "animado" | "guia";
  repeticion?: number;
}

const PAUSA_ENTRE_TRAZOS_MS = 260;

/**
 * Circulo rojo que recorre los trazos pedagogicos del glifo.
 * El glifo real de Edelfontmed se pinta en TrazoVocal; aqui solo va la guia.
 */
export function GuiaTrazo({ letra, modo, repeticion = 0 }: GuiaTrazoProps) {
  const trazos = RECORRIDOS_VOCALES[letra];
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [punto, setPunto] = useState({ x: 50, y: 50 });
  const [progresos, setProgresos] = useState<number[]>(() => trazos.map(() => 0));

  useEffect(() => {
    const elementos = refs.current.slice(0, trazos.length);
    const longitudes = elementos.map((elemento) => elemento?.getTotalLength() ?? 0);
    setProgresos(trazos.map(() => 0));

    const inicio = elementos[0]?.getPointAtLength(0);
    if (inicio) setPunto({ x: inicio.x, y: inicio.y });

    if (modo === "guia") return;

    const reducirMovimiento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducirMovimiento) {
      setProgresos(trazos.map(() => 1));
      const ultimo = elementos[elementos.length - 1];
      const final = ultimo?.getPointAtLength(longitudes[longitudes.length - 1] ?? 0);
      if (final) setPunto({ x: final.x, y: final.y });
      return;
    }

    const duraciones = longitudes.map((longitud) =>
      Math.max(450, Math.min(2200, longitud * 18))
    );
    const segmentos: { inicio: number; fin: number }[] = [];
    let cursor = 0;
    for (const duracion of duraciones) {
      segmentos.push({ inicio: cursor, fin: cursor + duracion });
      cursor += duracion + PAUSA_ENTRE_TRAZOS_MS;
    }
    const total = cursor;
    const comienzo = performance.now();
    let frame = 0;
    let cancelado = false;

    const tick = (ahora: number) => {
      if (cancelado) return;
      const transcurrido = Math.min(ahora - comienzo, total);
      const nuevos = trazos.map(() => 0);
      let posicion = { x: 50, y: 50 };

      for (let indice = 0; indice < segmentos.length; indice += 1) {
        const segmento = segmentos[indice];
        const elemento = elementos[indice];
        const longitud = longitudes[indice] ?? 0;

        if (transcurrido >= segmento.fin) {
          nuevos[indice] = 1;
          const fin = elemento?.getPointAtLength(longitud);
          if (fin) posicion = { x: fin.x, y: fin.y };
          continue;
        }

        if (transcurrido >= segmento.inicio) {
          const local = (transcurrido - segmento.inicio) / (segmento.fin - segmento.inicio);
          nuevos[indice] = local;
          const actual = elemento?.getPointAtLength(local * longitud);
          if (actual) posicion = { x: actual.x, y: actual.y };
        }
        break;
      }

      setProgresos(nuevos);
      setPunto(posicion);
      if (transcurrido < total) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelado = true;
      cancelAnimationFrame(frame);
    };
  }, [letra, modo, repeticion, trazos]);

  return (
    <g aria-hidden="true">
      {trazos.map((trazo, indice) => (
        <path
          key={`${letra}-${indice}`}
          ref={(elemento) => {
            refs.current[indice] = elemento;
          }}
          d={trazo}
          fill="none"
          stroke="#ef4444"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - Math.min(1, Math.max(0, progresos[indice] ?? 0))}
          opacity={modo === "guia" ? 0 : 1}
        />
      ))}
      <circle
        data-testid="guia-circulo"
        cx={punto.x}
        cy={punto.y}
        r={4.5}
        fill="#ef4444"
        stroke="#ffffff"
        strokeWidth={1.5}
        className={modo === "guia" ? "animate-pulse" : undefined}
      />
    </g>
  );
}
