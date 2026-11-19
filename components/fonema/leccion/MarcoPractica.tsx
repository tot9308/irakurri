"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Puntos } from "./MarcoPaso";

interface AccionPracticaProps {
  etiqueta: string;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  primario?: boolean;
  children: React.ReactNode;
}

/** Boton grande de control, con el mismo lenguaje visual que MenuControles. */
export function AccionPractica({
  etiqueta,
  ariaLabel,
  onClick,
  disabled = false,
  primario = false,
  children,
}: AccionPracticaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`touch-target-lg flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 py-2 text-[11px] font-semibold leading-none transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${
        primario
          ? "border-primary-700 bg-primary-700 text-white"
          : "border-neutral-200 bg-white text-neutral-700"
      }`}
    >
      {children}
      <span>{etiqueta}</span>
    </button>
  );
}

interface MarcoPracticaProps {
  titulo: string;
  indicacion: string;
  children: React.ReactNode;
  controles: React.ReactNode;
  onSiguiente: () => void;
  textoBoton?: string;
  deshabilitado?: boolean;
  hechos?: number;
  total?: number;
}

/**
 * Marco de practica con el mismo esquema que Segida: Stage fijo, ficha activa
 * dentro y controles fuera (laterales en escritorio, debajo en movil).
 * El avance sigue siendo manual para dejar tiempo a repetir en voz alta.
 */
export function MarcoPractica({
  titulo,
  indicacion,
  children,
  controles,
  onSiguiente,
  textoBoton = "Jarraitu",
  deshabilitado = false,
  hechos = 0,
  total = 0,
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
          {/* Mismo marco que Escenario, pero sin recorte: las rejillas de 5
              tarjetas pueden crecer en vertical sin que se corte ninguna. */}
          <div
            className="relative flex w-full flex-1 items-center justify-center rounded-[28px] border-4 border-neutral-200 bg-neutral-100 p-4 sm:p-6"
            style={{ minHeight: "clamp(260px, 44dvh, 540px)" }}
          >
            {children}
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[200px] lg:border-l lg:border-neutral-200 lg:pl-4">
          <div className="flex flex-col gap-4">
            <section className="grid grid-cols-2 gap-2 lg:grid-cols-1">{controles}</section>
            {total > 0 && (
              <div className="flex justify-center lg:justify-start">
                <Puntos hechos={hechos} total={total} />
              </div>
            )}
          </div>
          <Button
            onClick={onSiguiente}
            disabled={deshabilitado}
            className="w-full lg:mt-auto"
          >
            {textoBoton}
          </Button>
        </aside>
      </div>
    </div>
  );
}
