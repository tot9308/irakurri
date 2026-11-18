"use client";

import { Button } from "@/components/ui/Button";
import { IconoImagen, IconoPlay, IconoRepetir } from "@/components/ui/Iconos";

type Ejercicio = "leccion" | "secuencia" | "palabras";

interface SelectorEjercicioProps {
  fonema: string;
  pasosHechos: number;
  totalPasos: number;
  secuenciaCompletada: boolean;
  palabrasHechas: number;
  totalPalabras: number;
  onSelect: (ejercicio: Ejercicio) => void;
  onAtras: () => void;
}

/** Menu de ejercicios de la letra, con el progreso de cada uno. */
export function SelectorEjercicio({
  fonema,
  pasosHechos,
  totalPasos,
  secuenciaCompletada,
  palabrasHechas,
  totalPalabras,
  onSelect,
  onAtras,
}: SelectorEjercicioProps) {
  const sinPalabras = totalPalabras === 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col justify-center gap-6 p-6">
      <header className="text-center">
        <h1 className="text-lg font-semibold text-neutral-600">Aukeratu ariketa</h1>
        <p className="mt-1 text-4xl font-bold text-primary-700">{fonema}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onSelect("leccion")}
          className="touch-target-lg flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-primary-300 bg-primary-50 p-6 text-center transition-colors active:scale-95"
        >
          <IconoPlay className="h-10 w-10 text-primary-700" />
          <span className="text-xl font-semibold text-primary-800">Ikasi</span>
          <span className="text-sm text-neutral-600">Urratsez urrats</span>
          <span className="text-xs font-semibold text-neutral-500">
            {pasosHechos}/{totalPasos}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("secuencia")}
          className="touch-target-lg flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-neutral-300 bg-white p-6 text-center transition-colors active:scale-95"
        >
          <IconoRepetir className="h-10 w-10 text-neutral-700" />
          <span className="text-xl font-semibold text-neutral-800">Segida</span>
          <span className="text-sm text-neutral-600">Silabak bata bestearen atzetik</span>
          {secuenciaCompletada && (
            <span className="text-xs font-semibold text-emerald-700">Eginda</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect("palabras")}
          disabled={sinPalabras}
          className="touch-target-lg flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          <IconoImagen className="h-10 w-10 text-emerald-700" />
          <span className="text-xl font-semibold text-emerald-800">Hitzak</span>
          <span className="text-sm text-neutral-600">
            {sinPalabras ? "Audioa falta da" : "Osatu hitzak"}
          </span>
          {!sinPalabras && (
            <span className="text-xs font-semibold text-neutral-500">
              {palabrasHechas}/{totalPalabras}
            </span>
          )}
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
