"use client";

import { DURACIONES_MS } from "@/lib/audio-provider/manifest";
import { pasosDeFonema } from "@/lib/progreso";
import {
  PALABRAS_VOCALES,
  VOCALES,
  anclasVocales,
  claveAudioVocal,
  palabrasVocalesConAudio,
} from "@/lib/vocales";

export type VistaVocales = "letras" | "repetir" | "escuchar" | "inicial";

interface SelectorVocalesProps {
  onAbrir: (vista: VistaVocales) => void;
}

interface Actividad {
  id: VistaVocales;
  titulo: string;
  descripcion: string;
  habilitada: boolean;
}

/** Menu de las cuatro actividades de vocales, en el orden pedido. */
export function SelectorVocales({ onAbrir }: SelectorVocalesProps) {
  const hechos = pasosDeFonema("vocales");
  const conAudio = palabrasVocalesConAudio();
  const todasLasPalabras = conAudio.length === PALABRAS_VOCALES.length;
  const anclasDisponibles = anclasVocales().every((ancla) =>
    conAudio.some((palabra) => palabra.id === ancla.id)
  );
  const letrasDisponibles = VOCALES.every(
    (vocal) => claveAudioVocal(vocal) in DURACIONES_MS
  );

  const actividades: Actividad[] = [
    {
      id: "letras",
      titulo: "Letra eta trazoa",
      descripcion: "Minuskula eta maiuskula: animazioa + trazatzea",
      habilitada: letrasDisponibles,
    },
    {
      id: "repetir",
      titulo: "Errepikatu: letra + hitza",
      descripcion: "Entzun eta errepikatu ozen",
      habilitada: anclasDisponibles,
    },
    {
      id: "escuchar",
      titulo: "Entzun letra eta aukeratu",
      descripcion: "Aukeratu grafia zuzena",
      habilitada: letrasDisponibles,
    },
    {
      id: "inicial",
      titulo: "Entzun hitza eta aukeratu bokala",
      descripcion: "Hasierako letra",
      habilitada: todasLasPalabras,
    },
  ];

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-5">
      <p className="text-sm font-semibold text-neutral-600">Aukeratu ariketa bat.</p>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {actividades.map((actividad, indice) => {
          const hecho = hechos.includes(actividad.id);
          return (
            <button
              key={actividad.id}
              type="button"
              onClick={() => onAbrir(actividad.id)}
              disabled={!actividad.habilitada}
              aria-label={`${indice + 1}. ${actividad.titulo}`}
              className={`flex min-h-[112px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-55 ${
                hecho
                  ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300"
                  : "border-primary-200 bg-primary-50"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
                {indice + 1}
              </span>
              <span className="text-sm font-semibold leading-tight text-primary-900">
                {actividad.titulo}
              </span>
              <span className="text-xs text-neutral-600">{actividad.descripcion}</span>
              {hecho && (
                <span className="text-[11px] font-semibold text-emerald-700">Eginda</span>
              )}
              {!actividad.habilitada && (
                <span className="text-[11px] font-semibold text-neutral-500">
                  Grabazioak falta dira
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-semibold text-neutral-500">
        Hitzetarako grabazioak: {conAudio.length}/{PALABRAS_VOCALES.length}
      </p>
    </div>
  );
}
