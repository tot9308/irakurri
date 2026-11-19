"use client";

import { useEffect, useMemo, useState } from "react";
import { itemsByPhoneme } from "@/lib/catalog";
import { construirSecuencia } from "@/lib/fonema/secuencia";
import { PASOS, type PasoId } from "@/lib/leccion/pasos";
import { palabrasConAudio } from "@/lib/palabras";
import { marcarPasoCompletado, pasosDeFonema } from "@/lib/progreso";
import { PasoAnclas } from "./PasoAnclas";
import { PasoElegirImagen } from "./PasoElegirImagen";
import { PasoEscucharElegir } from "./PasoEscucharElegir";
import { PasoGrafema } from "./PasoGrafema";
import { PasoHitzak } from "./PasoHitzak";
import { PasoPseudopalabras } from "./PasoPseudopalabras";
import { PasoRepetir } from "./PasoRepetir";
import { PasoSilabak } from "./PasoSilabak";

interface LeccionProps {
  fonema: string;
  onAtras: () => void;
  pasoInicial?: PasoId;
}

/** Progresion completa de la letra en 8 pasos, con progreso persistente. */
export function Leccion({ fonema, onAtras, pasoInicial }: LeccionProps) {
  const silabas = useMemo(() => {
    const items = itemsByPhoneme(fonema).filter((item) => item.type === "syllable");
    return construirSecuencia(
      fonema,
      items.map((item) => item.grapheme)
    );
  }, [fonema]);

  const palabras = useMemo(() => palabrasConAudio(fonema), [fonema]);

  const [paso, setPaso] = useState<PasoId>("grafema");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (pasoInicial) {
      setPaso(pasoInicial);
      setListo(true);
      return;
    }
    const hechos = pasosDeFonema(fonema);
    const siguiente = PASOS.find((p) => !hechos.includes(p));
    setPaso(siguiente ?? "grafema");
    setListo(true);
  }, [fonema, pasoInicial]);

  const indice = PASOS.indexOf(paso);

  const completar = () => {
    marcarPasoCompletado(fonema, paso);
    const siguiente = PASOS[indice + 1];
    if (siguiente) setPaso(siguiente);
    else onAtras();
  };

  /** Salir desde la pantalla de resultado: cuenta el paso como hecho. */
  const salir = () => {
    marcarPasoCompletado(fonema, paso);
    onAtras();
  };

  const repetirLeccion = () => {
    marcarPasoCompletado(fonema, paso);
    setPaso(PASOS[0]);
  };

  const esUltimo = indice === PASOS.length - 1;
  const progreso = indice / PASOS.length;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-3 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAtras}
          className="touch-target flex items-center gap-1 rounded-xl px-2 text-sm font-semibold text-neutral-600"
        >
          <span aria-hidden="true">←</span> Atzera
        </button>
        <h1 className="flex items-baseline gap-2 text-lg font-semibold text-neutral-700">
          <span className="text-3xl font-bold text-primary-700">{fonema}</span>
          ikasi
        </h1>
        <span className="text-sm font-semibold text-neutral-500">
          {indice + 1}/{PASOS.length}
        </span>
      </header>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full bg-primary-600 transition-[width] duration-300"
          style={{ width: `${progreso * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col">
        {listo && (
          <div key={paso} className="flex flex-1 flex-col">
            {paso === "grafema" && <PasoGrafema fonema={fonema} onSiguiente={completar} />}
            {paso === "silabak" && (
              <PasoSilabak fonema={fonema} silabas={silabas} onSiguiente={completar} />
            )}
            {paso === "anclas" && (
              <PasoAnclas
                fonema={fonema}
                silabas={silabas}
                palabras={palabras}
                onSiguiente={completar}
              />
            )}
            {paso === "errepikatu" && (
              <PasoRepetir fonema={fonema} silabas={silabas} onSiguiente={completar} />
            )}
            {paso === "entzun" && (
              <PasoEscucharElegir
                fonema={fonema}
                silabas={silabas}
                esUltimo={esUltimo}
                onSiguiente={completar}
                onMenu={salir}
                onRepetir={repetirLeccion}
              />
            )}
            {paso === "pseudo" && (
              <PasoPseudopalabras fonema={fonema} onSiguiente={completar} />
            )}
            {paso === "hitzak" && <PasoHitzak palabras={palabras} onSiguiente={completar} />}
            {paso === "irudia" && (
              <PasoElegirImagen
                palabras={palabras}
                esUltimo={esUltimo}
                onSiguiente={completar}
                onMenu={salir}
                onRepetir={repetirLeccion}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
