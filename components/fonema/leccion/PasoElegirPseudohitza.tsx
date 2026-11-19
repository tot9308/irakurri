"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { claveAudio } from "@/lib/audio-provider/manifest";
import { reproducirSilabas } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import {
  PSEUDOPALABRAS,
  rondasDePseudopalabras,
  silabasDePseudopalabra,
} from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { MarcoPaso } from "./MarcoPaso";
import { PasoResultado } from "./PasoResultado";

interface PasoElegirPseudohitzaProps {
  fonema: string;
  esUltimo: boolean;
  onSiguiente: () => void;
  onMenu: () => void;
  onRepetir: () => void;
}

const TOTAL_RONDAS = 6;
const ESPERA_ACIERTO_MS = 700;
const ESPERA_ERROR_MS = 500;

/** Paso 7: suena una pseudopalabra y se elige cómo se escribe. */
export function PasoElegirPseudohitza({
  fonema,
  esUltimo,
  onSiguiente,
  onMenu,
  onRepetir,
}: PasoElegirPseudohitzaProps) {
  const proveedor = useProveedorAudio();
  const [rondas] = useState(() => rondasDePseudopalabras(TOTAL_RONDAS, 53, 4));
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [acierto, setAcierto] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falloEnRonda, setFalloEnRonda] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ronda = rondas[indice];
  const objetivo = ronda?.objetivo ?? "";
  const clave = claveAudio("pseudohitzak", objetivo);

  const reproducir = useCallback(() => {
    if (!objetivo) return;
    if (proveedor.disponible(clave)) {
      void proveedor.play(clave);
      return;
    }
    void reproducirSilabas(proveedor, fonema, silabasDePseudopalabra(objetivo));
  }, [proveedor, fonema, objetivo, clave]);

  useEffect(() => {
    proveedor.precargar(PSEUDOPALABRAS.map((p) => claveAudio("pseudohitzak", p)));
  }, [proveedor]);

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

  const elegir = (opcion: string) => {
    if (acierto) return;
    setElegida(opcion);
    const correcto = opcion === objetivo;
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
        titulo={`${indiceGlobal("pseudoElegir")} · Aukeratu pseudohitza`}
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
        titulo={`${indiceGlobal("pseudoElegir")} · Aukeratu pseudohitza`}
        indicacion="Oraindik ez dago pseudohitzik."
        onSiguiente={onSiguiente}
      >
        <p className="max-w-sm text-center text-neutral-500">
          Gehitu audioak eta hemen agertuko dira.
        </p>
      </MarcoPaso>
    );
  }

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("pseudoElegir")} · Aukeratu pseudohitza`}
      indicacion="Entzun eta sakatu nola idazten den."
      onSiguiente={avanzar}
      hechos={indice + (acierto ? 1 : 0)}
      total={rondas.length}
    >
      <div className="flex flex-col items-center gap-5">
        <Button variant="secondary" onClick={reproducir}>
          <IconoSoinua className="mr-2 h-5 w-5" />
          Berriz entzun
        </Button>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {ronda.opciones.map((opcion) => {
            const estado =
              elegida === opcion ? (acierto ? "correcta" : "incorrecta") : "neutra";
            return (
              <button
                key={opcion}
                type="button"
                onClick={() => elegir(opcion)}
                aria-label={`Pseudohitza ${opcion}`}
                className={`flex min-h-[64px] items-center justify-center rounded-2xl border-[3px] px-3 font-lectura text-[clamp(1.1rem,4vw,1.6rem)] font-bold leading-none transition-colors active:scale-95 ${
                  estado === "correcta"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : estado === "incorrecta"
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-neutral-300 bg-white text-neutral-800"
                }`}
              >
                {opcion}
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
