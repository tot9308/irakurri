"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import {
  IconoAvanzar,
  IconoParar,
  IconoPausa,
  IconoPlay,
  IconoRepetir,
} from "@/components/ui/Iconos";
import { VELOCIDADES, type Fase, type Velocidad } from "@/lib/fonema/secuencia";

interface MenuControlesProps {
  fase: Fase;
  velocidad: Velocidad;
  onVelocidad: (velocidad: Velocidad) => void;
  onIniciar: () => void;
  onPausar: () => void;
  onReanudar: () => void;
  onRepetir: () => void;
  onSaltar: () => void;
  onGelditu: () => void;
  onSiguiente: () => void;
  /** Sustantivo para las etiquetas accesibles (silaba, hitza, pseudohitza...). */
  etiquetaRepetir?: string;
  etiquetaSaltar?: string;
  /** Texto bajo la velocidad (por defecto, "Silaben arteko tartea"). */
  etiquetaTartea?: string;
  /** Texto del boton de avance (por defecto, "Hurrengo ariketa"). */
  textoSiguiente?: string;
}

function textoVelocidad(v: number): string {
  return `${v.toString().replace(".", ",")}×`;
}

interface AccionBotonProps {
  etiqueta: string;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  primario?: boolean;
  children: React.ReactNode;
}

function AccionBoton({
  etiqueta,
  ariaLabel,
  onClick,
  disabled = false,
  primario = false,
  children,
}: AccionBotonProps) {
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

/**
 * Controles externos al Stage. En apaisado va como columna a la derecha;
 * en vertical, como barra inferior. Nunca se superpone al Stage.
 */
export function MenuControles({
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
  etiquetaRepetir = "silaba",
  etiquetaSaltar = "silabara",
  etiquetaTartea = "Silaben arteko tartea",
  textoSiguiente = "Hurrengo ariketa",
}: MenuControlesProps) {
  const enMarcha = fase === "presentando";
  const pausado = fase === "pausado";
  const completado = fase === "completado";
  const inactivo = fase === "inactivo";

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[200px] lg:border-l lg:border-neutral-200 lg:pl-4">
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          Abiadura
        </h2>
        <div className="mt-2 grid grid-cols-5 gap-1.5 lg:grid-cols-3">
          {VELOCIDADES.map((v) => {
            const activa = v === velocidad;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onVelocidad(v)}
                aria-pressed={activa}
                aria-label={`Abiadura ${textoVelocidad(v)}`}
                className={`min-h-[48px] rounded-xl border-2 text-sm font-semibold transition-colors active:scale-95 ${
                  activa
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {textoVelocidad(v)}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] leading-tight text-neutral-500">
          {etiquetaTartea}
        </p>
      </section>

      <section className="grid grid-cols-4 gap-2 lg:grid-cols-2">
        {enMarcha || pausado ? (
          <AccionBoton
            etiqueta={pausado ? "Jarraitu" : "Pausatu"}
            ariaLabel={pausado ? "Jarraitu sekuentzia" : "Pausatu sekuentzia"}
            onClick={pausado ? onReanudar : onPausar}
            primario
          >
            {pausado ? <IconoPlay className="h-8 w-8" /> : <IconoPausa className="h-8 w-8" />}
          </AccionBoton>
        ) : (
          <AccionBoton
            etiqueta={completado ? "Berriz hasi" : "Hasi"}
            ariaLabel={completado ? "Hasi berriz hasieratik" : "Hasi sekuentzia"}
            onClick={onIniciar}
            primario
          >
            <IconoPlay className="h-8 w-8" />
          </AccionBoton>
        )}

        <AccionBoton
          etiqueta="Errepikatu"
          ariaLabel={`Errepikatu ${etiquetaRepetir}`}
          onClick={onRepetir}
          disabled={inactivo}
        >
          <IconoRepetir className="h-8 w-8" />
        </AccionBoton>

        <AccionBoton
          etiqueta="Saltatu"
          ariaLabel={`Saltatu hurrengo ${etiquetaSaltar}`}
          onClick={onSaltar}
          disabled={inactivo || completado}
        >
          <IconoAvanzar className="h-8 w-8" />
        </AccionBoton>

        <AccionBoton
          etiqueta="Gelditu"
          ariaLabel="Gelditu eta garbitu"
          onClick={onGelditu}
          disabled={inactivo}
        >
          <IconoParar className="h-8 w-8" />
        </AccionBoton>
      </section>

      <Button variant="secondary" onClick={onSiguiente} disabled={!completado}>
        {textoSiguiente}
      </Button>
    </aside>
  );
}
