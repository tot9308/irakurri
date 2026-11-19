"use client";

import { useCallback, useEffect, useState } from "react";
import { reproducirSilaba } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { rondasDeSilabas } from "@/lib/leccion/pasos";
import { MarcoPaso } from "./MarcoPaso";

interface PasoRepetirProps {
  fonema: string;
  silabas: readonly string[];
  onSiguiente: () => void;
}

/** Paso 4: las silabas salen en orden no alfabetico; el nino las repite. */
export function PasoRepetir({ fonema, silabas, onSiguiente }: PasoRepetirProps) {
  const proveedor = useProveedorAudio();
  const [rondas] = useState(() => rondasDeSilabas(silabas, 8, 17));
  const [indice, setIndice] = useState(0);
  const silaba = rondas[indice] ?? "";

  const reproducir = useCallback(() => {
    if (!silaba) return;
    reproducirSilaba(proveedor, fonema, silaba);
  }, [proveedor, fonema, silaba]);

  useEffect(() => {
    const temporizador = setTimeout(reproducir, 300);
    return () => clearTimeout(temporizador);
  }, [reproducir]);

  const avanzar = () => {
    if (indice + 1 >= rondas.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("errepikatu")} · Errepikatu`}
      indicacion="Entzun silaba eta errepikatu ozen."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={rondas.length}
    >
      <button
        type="button"
        onClick={reproducir}
        aria-label={`Silaba ${silaba}`}
        className="ficha-entrada flex h-[clamp(110px,22vw,190px)] w-[clamp(110px,22vw,190px)] items-center justify-center rounded-3xl border-[3px] border-primary-700 bg-primary-700 font-lectura text-[clamp(3rem,10vw,6rem)] font-bold leading-none text-white active:scale-95"
      >
        {silaba}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {silaba}
      </p>
    </MarcoPaso>
  );
}
