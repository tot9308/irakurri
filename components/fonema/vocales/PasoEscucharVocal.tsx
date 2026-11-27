"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconoSoinua } from "@/components/ui/Iconos";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { formatearTexto, type FormatoTexto } from "@/lib/formato-texto";
import { opcionesDeVocal, rondasDeVocales } from "@/lib/leccion/vocales";
import { VOCALES, claveAudioVocal, type Vocal } from "@/lib/vocales";
import { MarcoPaso } from "../leccion/MarcoPaso";
import { PasoResultado } from "../leccion/PasoResultado";

interface PasoEscucharVocalProps {
  formato: FormatoTexto;
  onSalir: () => void;
}

const TOTAL_RONDAS = 10;
const ESPERA_ACIERTO_MS = 700;
const ESPERA_ERROR_MS = 500;

/** Actividad 3: suena una vocal y hay que elegir su grafia entre las cinco. */
export function PasoEscucharVocal({ formato, onSalir }: PasoEscucharVocalProps) {
  const proveedor = useProveedorAudio();
  const [rondas] = useState(() => rondasDeVocales(TOTAL_RONDAS, 31));
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<Vocal | null>(null);
  const [acierto, setAcierto] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falloEnRonda, setFalloEnRonda] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const objetivo = rondas[indice] ?? "a";
  const opciones = opcionesDeVocal(indice + 31);

  const reproducir = useCallback(() => {
    const clave = claveAudioVocal(objetivo);
    if (proveedor.disponible(clave)) void proveedor.play(clave);
  }, [objetivo, proveedor]);

  useEffect(() => {
    const temporizador = setTimeout(reproducir, 350);
    return () => clearTimeout(temporizador);
  }, [reproducir]);

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

  const elegir = (vocal: Vocal) => {
    if (elegida !== null && acierto) return;
    setElegida(vocal);
    const correcto = vocal === objetivo;
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

  const reiniciar = () => {
    setIndice(0);
    setElegida(null);
    setAcierto(null);
    setAciertos(0);
    setFalloEnRonda(false);
    setTerminado(false);
  };

  if (terminado) {
    return (
      <PasoResultado
        titulo="3 · Entzun letra eta aukeratu"
        aciertos={aciertos}
        total={rondas.length}
        esUltimo
        onSiguiente={onSalir}
        onMenu={onSalir}
        onRepetir={reiniciar}
      />
    );
  }

  return (
    <MarcoPaso
      titulo="3 · Entzun letra eta aukeratu"
      indicacion="Entzun bokala eta sakatu zein letra den."
      onSiguiente={avanzar}
      hechos={indice + (acierto ? 1 : 0)}
      total={rondas.length}
    >
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={reproducir}
          aria-label="Berriz entzun bokala"
          className="touch-target-lg flex items-center gap-2 rounded-2xl border-2 border-primary-300 bg-primary-50 px-6 text-primary-800"
        >
          <IconoSoinua className="h-8 w-8" />
          Entzun
        </button>

        <div className="grid grid-cols-5 gap-1.5">
          {opciones.map((vocal, posicion) => {
            const estado =
              elegida === vocal ? (acierto ? "correcta" : "incorrecta") : "neutra";
            return (
              <button
                key={vocal}
                type="button"
                onClick={() => elegir(vocal)}
                aria-label={`Bokala ${vocal}`}
                className={`flex h-[clamp(52px,13vw,88px)] w-[clamp(52px,13vw,88px)] items-center justify-center rounded-2xl border-[3px] font-lectura text-[clamp(1.6rem,5vw,2.8rem)] font-bold leading-none transition-colors active:scale-95 ${
                  estado === "correcta"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : estado === "incorrecta"
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-neutral-300 bg-white text-neutral-800"
                }`}
              >
                {formatearTexto(vocal, formato, posicion)}
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
        <p className="sr-only">{VOCALES.length} aukera</p>
      </div>
    </MarcoPaso>
  );
}
