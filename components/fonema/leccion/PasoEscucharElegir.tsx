"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconoSoinua } from "@/components/ui/Iconos";
import { reproducirSilaba } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { opcionesDeSilaba, rondasDeSilabas } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { MarcoPaso } from "./MarcoPaso";
import { PasoResultado } from "./PasoResultado";

interface PasoEscucharElegirProps {
  fonema: string;
  silabas: readonly string[];
  esUltimo: boolean;
  onSiguiente: () => void;
  onMenu: () => void;
  onRepetir: () => void;
}

const TOTAL_RONDAS = 12;
const ESPERA_ACIERTO_MS = 700;
const ESPERA_ERROR_MS = 500;

/** Paso 5: suena una silaba y hay que elegirla entre las cinco. */
export function PasoEscucharElegir({
  fonema,
  silabas,
  esUltimo,
  onSiguiente,
  onMenu,
  onRepetir,
}: PasoEscucharElegirProps) {
  const proveedor = useProveedorAudio();
  const [rondas] = useState(() => rondasDeSilabas(silabas, TOTAL_RONDAS, 29));
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [acierto, setAcierto] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falloEnRonda, setFalloEnRonda] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const objetivo = rondas[indice] ?? "";
  const opciones = opcionesDeSilaba(objetivo, silabas, 5, indice + 29);

  const reproducir = useCallback(() => {
    if (!objetivo) return;
    reproducirSilaba(proveedor, fonema, objetivo);
  }, [proveedor, fonema, objetivo]);

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

  const elegir = (silaba: string) => {
    if (elegida !== null && acierto) return;
    setElegida(silaba);
    const correcto = silaba === objetivo;
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
        titulo={`${indiceGlobal("entzun")} · Entzun eta aukeratu`}
        aciertos={aciertos}
        total={rondas.length}
        esUltimo={esUltimo}
        onSiguiente={onSiguiente}
        onMenu={onMenu}
        onRepetir={onRepetir}
      />
    );
  }

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("entzun")} · Entzun eta aukeratu`}
      indicacion="Entzun silaba eta sakatu zein den."
      onSiguiente={avanzar}
      hechos={indice + (acierto ? 1 : 0)}
      total={rondas.length}
    >
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={reproducir}
          aria-label="Berriz entzun"
          className="touch-target-lg flex items-center gap-2 rounded-2xl border-2 border-primary-300 bg-primary-50 px-6 text-primary-800"
        >
          <IconoSoinua className="h-8 w-8" />
          Entzun
        </button>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
          {opciones.map((silaba) => {
            const estado =
              elegida === silaba ? (acierto ? "correcta" : "incorrecta") : "neutra";
            return (
              <button
                key={silaba}
                type="button"
                onClick={() => elegir(silaba)}
                aria-label={`Silaba ${silaba}`}
                className={`flex h-[clamp(64px,12vw,104px)] w-[clamp(64px,12vw,104px)] items-center justify-center rounded-2xl border-[3px] text-[clamp(1.6rem,5vw,3rem)] font-bold leading-none transition-colors active:scale-95 ${
                  estado === "correcta"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : estado === "incorrecta"
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-neutral-300 bg-white text-neutral-800"
                }`}
              >
                {silaba}
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
