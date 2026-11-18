"use client";

import type { FaseConstructor } from "@/lib/fonema/constructor";

interface ZonaEnsamblajeProps {
  total: number;
  colocadas: string[];
  fase: FaseConstructor;
  onQuitar: (posicion: number) => void;
}

const TAMANO = "h-[clamp(72px,8vw,96px)] w-[clamp(72px,8vw,96px)]";

/**
 * Huecos de la palabra. Tocar una silaba colocada la retira (no hay dead-ends).
 * Los huecos vacios se reservan siempre para que nada se mueva.
 */
export function ZonaEnsamblaje({ total, colocadas, fase, onQuitar }: ZonaEnsamblajeProps) {
  const color =
    fase === "error"
      ? "border-rose-400 bg-rose-50 text-rose-700"
      : fase === "correcto"
        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
        : null;

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      aria-label="Hitza osatzeko lekuak"
    >
      {Array.from({ length: total }).map((_, posicion) => {
        const silaba = colocadas[posicion];
        const clases = `flex items-center justify-center rounded-2xl border-[3px] text-[clamp(1.8rem,5.5vw,3.5rem)] font-bold leading-none transition-colors ${TAMANO}`;

        if (silaba === undefined) {
          return (
            <div
              key={`hueco-${posicion}`}
              aria-hidden="true"
              className={`${clases} border-dashed border-neutral-300 bg-white text-neutral-300`}
            />
          );
        }

        return (
          <button
            key={`silaba-${posicion}`}
            type="button"
            onClick={() => onQuitar(posicion)}
            disabled={fase === "correcto"}
            aria-label={`${silaba} kendu`}
            className={`${clases} ${
              color ?? "border-primary-700 bg-primary-700 text-white active:scale-95"
            }`}
          >
            {silaba}
          </button>
        );
      })}
    </div>
  );
}
