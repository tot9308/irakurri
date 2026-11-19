"use client";

import * as React from "react";
import type { EstadoFicha } from "@/lib/fonema/secuencia";

interface FichaSilabaProps {
  silaba: string;
  estado: EstadoFicha;
  /** Cambia de valor para relanzar el "agrandado momentaneo" (repetir / tap). */
  pulsoVeces?: number;
  onRepetir?: () => void;
}

const ESTILOS: Record<Exclude<EstadoFicha, "oculta">, string> = {
  activa: "border-primary-700 bg-primary-700 text-white shadow-lg",
  atenuada: "border-neutral-200 bg-white text-neutral-500",
  completa: "border-neutral-300 bg-white text-neutral-800",
};

/**
 * Ficha de silaba. El hueco (slot) se reserva siempre, aunque la ficha este oculta,
 * para que el Stage no se mueva ni un pixel al ir apareciendo la secuencia.
 */
export function FichaSilaba({
  silaba,
  estado,
  pulsoVeces = 0,
  onRepetir,
}: FichaSilabaProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (pulsoVeces <= 0 || !ref.current) return;
    if (typeof ref.current.animate !== "function") return;
    ref.current.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.14)", offset: 0.45 },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-in-out" }
    );
  }, [pulsoVeces]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "var(--slot)", height: "var(--slot)" }}
    >
      {estado !== "oculta" && (
        <button
          ref={ref}
          type="button"
          onClick={onRepetir}
          aria-label={`${silaba} silaba. Sakatu berriz entzuteko.`}
          className={`ficha-entrada flex h-full w-full items-center justify-center rounded-3xl border-[3px] font-lectura text-[clamp(2rem,6.4vw,4.5rem)] font-bold leading-none transition-colors duration-200 ${ESTILOS[estado]}`}
        >
          {silaba}
        </button>
      )}
    </div>
  );
}
