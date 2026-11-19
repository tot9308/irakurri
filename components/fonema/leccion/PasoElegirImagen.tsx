"use client";

import { useEffect, useRef, useState } from "react";
import { ImagenPalabra } from "@/components/fonema/ImagenPalabra";
import { rondasDePalabras } from "@/lib/leccion/pasos";
import { textoPalabra, type Palabra } from "@/lib/palabras";
import { MarcoPaso } from "./MarcoPaso";
import { PasoResultado } from "./PasoResultado";

interface PasoElegirImagenProps {
  palabras: readonly Palabra[];
  esUltimo: boolean;
  onSiguiente: () => void;
  onMenu: () => void;
  onRepetir: () => void;
}

const ESPERA_ACIERTO_MS = 700;
const ESPERA_ERROR_MS = 500;

/** Paso 8: palabra escrita -> elegir su foto entre tres. */
export function PasoElegirImagen({
  palabras,
  esUltimo,
  onSiguiente,
  onMenu,
  onRepetir,
}: PasoElegirImagenProps) {
  const [rondas] = useState(() => rondasDePalabras(palabras, 6, 41));
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [acierto, setAcierto] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falloEnRonda, setFalloEnRonda] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ronda = rondas[indice];

  useEffect(
    () => () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    },
    []
  );

  const avanzar = () => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    setElegida(null);
    setAcierto(null);
    setFalloEnRonda(false);
    if (indice + 1 >= rondas.length) setTerminado(true);
    else setIndice(indice + 1);
  };

  const elegir = (id: string) => {
    if (!ronda || acierto) return;
    setElegida(id);
    const correcto = id === ronda.objetivo.id;
    setAcierto(correcto);
    if (correcto) {
      if (!falloEnRonda) setAciertos((total) => total + 1);
      temporizadorRef.current = setTimeout(avanzar, ESPERA_ACIERTO_MS);
    } else {
      setFalloEnRonda(true);
      temporizadorRef.current = setTimeout(() => {
        setElegida(null);
        setAcierto(null);
      }, ESPERA_ERROR_MS);
    }
  };

  if (terminado) {
    return (
      <PasoResultado
        titulo="8 · Aukeratu irudia"
        aciertos={aciertos}
        total={rondas.length}
        esUltimo={esUltimo}
        onSiguiente={onSiguiente}
        onMenu={onMenu}
        onRepetir={onRepetir}
      />
    );
  }

  if (!ronda) {
    return (
      <MarcoPaso
        titulo="8 · Aukeratu irudia"
        indicacion="Oraindik ez dago argazkirik fonema honetarako."
        onSiguiente={onSiguiente}
      >
        <p className="max-w-sm text-center text-neutral-500">
          Gehitu hitz bat bere argazkiarekin eta hemen agertuko da.
        </p>
      </MarcoPaso>
    );
  }

  return (
    <MarcoPaso
      titulo="8 · Aukeratu irudia"
      indicacion="Irakurri hitza eta aukeratu bere argazkia."
      onSiguiente={avanzar}
      hechos={indice + (acierto ? 1 : 0)}
      total={rondas.length}
    >
      <div className="flex flex-col items-center gap-5">
        <p
          data-testid="palabra-objetivo"
          className="text-[clamp(2.2rem,7vw,4rem)] font-bold tracking-wide text-neutral-800"
        >
          {textoPalabra(ronda.objetivo)}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {ronda.opciones.map((opcion) => {
            const estado =
              elegida === opcion.id ? (acierto ? "correcta" : "incorrecta") : "neutra";
            return (
              <button
                key={opcion.id}
                type="button"
                onClick={() => elegir(opcion.id)}
                aria-label={`Irudia ${opcion.id}`}
                className={`h-[clamp(96px,19vw,150px)] w-[clamp(96px,19vw,150px)] overflow-hidden rounded-2xl border-[3px] bg-white transition-colors active:scale-95 ${
                  estado === "correcta"
                    ? "border-emerald-500 ring-2 ring-emerald-500"
                    : estado === "incorrecta"
                      ? "border-rose-400 ring-2 ring-rose-400"
                      : "border-neutral-200"
                }`}
              >
                <ImagenPalabra id={opcion.id} alt={textoPalabra(opcion)} />
              </button>
            );
          })}
        </div>

        <p role="status" aria-live="polite" className="min-h-6 text-lg font-semibold">
          {acierto === true ? (
            <span className="text-emerald-700">Oso ondo!</span>
          ) : acierto === false ? (
            <span className="text-rose-700">Saiatu berriro</span>
          ) : null}
        </p>
      </div>
    </MarcoPaso>
  );
}
