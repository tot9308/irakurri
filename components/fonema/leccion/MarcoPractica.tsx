"use client";

import * as React from "react";
import { MenuControles } from "../MenuControles";
import { Puntos } from "./MarcoPaso";
import type { Fase, Velocidad } from "@/lib/fonema/secuencia";

interface MarcoPracticaProps {
  titulo: string;
  indicacion: string;
  children: React.ReactNode;
  fase: Fase;
  velocidad: Velocidad;
  onVelocidad: (v: Velocidad) => void;
  onIniciar: () => void;
  onPausar: () => void;
  onReanudar: () => void;
  onRepetir: () => void;
  onSaltar: () => void;
  onGelditu: () => void;
  onSiguiente: () => void;
  hechos?: number;
  total?: number;
  etiquetaRepetir?: string;
  etiquetaSaltar?: string;
  etiquetaTartea?: string;
}

/**
 * Marco de practica con el mismo esquema que Segida: Stage fijo, elemento
 * actual dentro y controles fuera (laterales en escritorio, debajo en movil).
 * El reproductor permite play/pausa, stop, repetir, saltar y cambiar velocidad.
 */
export function MarcoPractica({
  titulo,
  indicacion,
  children,
  fase,
  velocidad,
  onVelocidad,
  onIniciar,
  onPausar,
  onReanudar,
  onRepetir,
  onSaltar,
  onGelditu,
  onSiguiente,
  hechos = 0,
  total = 0,
  etiquetaRepetir,
  etiquetaSaltar,
  etiquetaTartea,
}: MarcoPracticaProps) {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          {titulo}
        </p>
        <p className="text-lg text-neutral-700">{indicacion}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col">
          {/* Mismo marco que Escenario, pero sin recorte: el contenido puede
              crecer en vertical sin que se corte nada. */}
          <div
            className="relative flex w-full flex-1 items-center justify-center rounded-[28px] border-4 border-neutral-200 bg-neutral-100 p-4 sm:p-6"
            style={{ minHeight: "clamp(260px, 44dvh, 540px)" }}
          >
            {children}
          </div>
          {total > 0 && (
            <div className="mt-3 flex justify-center">
              <Puntos hechos={hechos} total={total} />
            </div>
          )}
        </div>

        <MenuControles
          fase={fase}
          velocidad={velocidad}
          onVelocidad={onVelocidad}
          onIniciar={onIniciar}
          onPausar={onPausar}
          onReanudar={onReanudar}
          onRepetir={onRepetir}
          onSaltar={onSaltar}
          onGelditu={onGelditu}
          onSiguiente={onSiguiente}
          etiquetaRepetir={etiquetaRepetir}
          etiquetaSaltar={etiquetaSaltar}
          etiquetaTartea={etiquetaTartea}
        />
      </div>
    </div>
  );
}
