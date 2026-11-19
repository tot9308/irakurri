"use client";

import { Button } from "@/components/ui/Button";
import { IconoCheck, IconoImagen, IconoRepetir } from "@/components/ui/Iconos";
import { ETIQUETAS_CORTAS, PASOS, type PasoId } from "@/lib/leccion/pasos";

interface SelectorEjercicioProps {
  fonema: string;
  pasosCompletados: string[];
  secuenciaCompletada: boolean;
  palabrasHechas: number;
  totalPalabras: number;
  onLeccion: (paso: PasoId) => void;
  onSecuencia: () => void;
  onPalabras: () => void;
  onAtras: () => void;
}

/**
 * Menu por niveles, con TODOS los botones visibles:
 * 1 (azul) los 8 pasos de la leccion, 2 (ambar) la secuencia, 3 (verde) el constructor.
 */
export function SelectorEjercicio({
  fonema,
  pasosCompletados,
  secuenciaCompletada,
  palabrasHechas,
  totalPalabras,
  onLeccion,
  onSecuencia,
  onPalabras,
  onAtras,
}: SelectorEjercicioProps) {
  const sinPalabras = totalPalabras === 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col justify-center gap-6 p-4 sm:p-6">
      <header className="text-center">
        <h1 className="text-lg font-semibold text-neutral-600">Aukeratu ariketa</h1>
        <p className="mt-1 text-4xl font-bold text-primary-700">{fonema}</p>
      </header>

      <section aria-labelledby="nivel-1">
        <h2
          id="nivel-1"
          className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-xs text-white">
            1
          </span>
          Fonema ikasi
          <span className="ml-auto text-xs font-semibold normal-case text-neutral-500">
            {pasosCompletados.length}/{PASOS.length}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PASOS.map((paso, indice) => {
            const hecho = pasosCompletados.includes(paso);
            return (
              <button
                key={paso}
                type="button"
                onClick={() => onLeccion(paso)}
                aria-label={`${indice + 1}. ${ETIQUETAS_CORTAS[paso]}`}
                className={`flex min-h-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2 text-center transition-colors active:scale-95 ${
                  hecho
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-primary-300 bg-primary-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    hecho ? "bg-emerald-600 text-white" : "bg-primary-700 text-white"
                  }`}
                >
                  {hecho ? <IconoCheck className="h-4 w-4" /> : indice + 1}
                </span>
                <span
                  className={`text-sm font-semibold leading-tight ${
                    hecho ? "text-emerald-800" : "text-primary-800"
                  }`}
                >
                  {ETIQUETAS_CORTAS[paso]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="nivel-2">
        <h2
          id="nivel-2"
          className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs text-white">
            2
          </span>
          Praktikatu
        </h2>
        <button
          type="button"
          onClick={onSecuencia}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-left transition-colors active:scale-[0.99]"
        >
          <IconoRepetir className="h-9 w-9 shrink-0 text-amber-700" />
          <span className="flex flex-col">
            <span className="text-lg font-semibold text-amber-900">Segida</span>
            <span className="text-sm text-neutral-600">Silabak bata bestearen atzetik</span>
          </span>
          {secuenciaCompletada && (
            <span className="ml-auto text-xs font-semibold text-emerald-700">Eginda</span>
          )}
        </button>
      </section>

      <section aria-labelledby="nivel-3">
        <h2
          id="nivel-3"
          className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
            3
          </span>
          Hitzak
        </h2>
        <button
          type="button"
          onClick={onPalabras}
          disabled={sinPalabras}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-left transition-colors active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          <IconoImagen className="h-9 w-9 shrink-0 text-emerald-700" />
          <span className="flex flex-col">
            <span className="text-lg font-semibold text-emerald-900">Hitzak</span>
            <span className="text-sm text-neutral-600">
              {sinPalabras ? "Audioa falta da" : "Osatu hitzak silabekin"}
            </span>
          </span>
          {!sinPalabras && (
            <span className="ml-auto text-xs font-semibold text-neutral-500">
              {palabrasHechas}/{totalPalabras}
            </span>
          )}
        </button>
      </section>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onAtras}>
          Atzera
        </Button>
      </div>
    </div>
  );
}
