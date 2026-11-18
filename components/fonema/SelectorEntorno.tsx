"use client";

import { Button } from "@/components/ui/Button";
import { IconoImagen, IconoPlay } from "@/components/ui/Iconos";

type Entorno = "secuencia" | "palabras";

interface SelectorEntornoProps {
  fonema: string;
  secuenciaCompletada: boolean;
  palabrasDisponibles: number;
  onSelect: (entorno: Entorno) => void;
  onAtras: () => void;
}

/** Eleccion entre los dos entornos de la letra, con tarjetas grandes. */
export function SelectorEntorno({
  fonema,
  secuenciaCompletada,
  palabrasDisponibles,
  onSelect,
  onAtras,
}: SelectorEntornoProps) {
  const sinPalabras = palabrasDisponibles === 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center gap-6 p-6">
      <header className="text-center">
        <h1 className="text-lg font-semibold text-neutral-600">Aukeratu ariketa</h1>
        <p className="mt-1 text-4xl font-bold text-primary-700">{fonema}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("secuencia")}
          className="touch-target-lg flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-primary-300 bg-primary-50 p-8 text-center transition-colors active:scale-95"
        >
          <IconoPlay className="h-10 w-10 text-primary-700" />
          <span className="text-xl font-semibold text-primary-800">Segida</span>
          <span className="text-sm text-neutral-600">Silabak bata bestearen atzetik</span>
          {secuenciaCompletada && (
            <span className="text-xs font-semibold text-emerald-700">Eginda</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect("palabras")}
          disabled={sinPalabras}
          className="touch-target-lg flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-8 text-center transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          <IconoImagen className="h-10 w-10 text-emerald-700" />
          <span className="text-xl font-semibold text-emerald-800">Hitzak</span>
          <span className="text-sm text-neutral-600">
            {sinPalabras ? "Audioa falta da" : `Osatu hitzak (${palabrasDisponibles})`}
          </span>
        </button>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onAtras}>
          Atzera
        </Button>
      </div>
    </div>
  );
}
