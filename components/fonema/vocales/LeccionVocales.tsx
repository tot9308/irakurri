"use client";

import { useState } from "react";
import { marcarPasoCompletado, pasosDeFonema } from "@/lib/progreso";
import { anclasVocales, palabrasVocalesConAudio } from "@/lib/vocales";
import { PasoElegirVocalInicial } from "./PasoElegirVocalInicial";
import { PasoEscucharVocal } from "./PasoEscucharVocal";
import { PasoLetrasVocales } from "./PasoLetrasVocales";
import { PasoRepetirVocalPalabra } from "./PasoRepetirVocalPalabra";
import { SelectorVocales, type VistaVocales } from "./SelectorVocales";

interface LeccionVocalesProps {
  onAtras: () => void;
}

type Vista = "menu" | VistaVocales;

/** Seccion de vocales: menu de cuatro actividades + pantallas de practica. */
export function LeccionVocales({ onAtras }: LeccionVocalesProps) {
  const [vista, setVista] = useState<Vista>("menu");
  const anclas = anclasVocales();
  const conAudio = palabrasVocalesConAudio();
  const hechos = pasosDeFonema("vocales");

  const volver = () => setVista("menu");
  const completar = (id: string) => {
    marcarPasoCompletado("vocales", id);
    volver();
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col gap-3 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={vista === "menu" ? onAtras : volver}
          className="touch-target flex items-center gap-1 rounded-xl px-2 text-sm font-semibold text-neutral-600"
        >
          <span aria-hidden="true">←</span> Atzera
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-neutral-700">Bokalek</h1>
          <p className="font-lectura text-xl font-bold tracking-[0.25em] text-primary-700">
            a e i o u
          </p>
        </div>
        <span className="text-sm font-semibold text-neutral-500">
          {vista === "menu" ? `${hechos.length}/4` : ""}
        </span>
      </header>

      <main className="flex flex-1 flex-col">
        {vista === "menu" && (
          <SelectorVocales onAbrir={(siguiente) => setVista(siguiente)} />
        )}
        {vista === "letras" && (
          <PasoLetrasVocales onSiguiente={() => completar("letras")} />
        )}
        {vista === "repetir" && (
          <PasoRepetirVocalPalabra palabras={anclas} onSiguiente={() => completar("repetir")} />
        )}
        {vista === "escuchar" && (
          <PasoEscucharVocal onSalir={() => completar("escuchar")} />
        )}
        {vista === "inicial" && (
          <PasoElegirVocalInicial palabras={conAudio} onSalir={() => completar("inicial")} />
        )}
      </main>
    </div>
  );
}
