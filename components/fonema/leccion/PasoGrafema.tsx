"use client";

import { useEffect } from "react";
import { IconoSoinua } from "@/components/ui/Iconos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { claveAudio, FONEMAS_CON_AUDIO_AISLADO } from "@/lib/audio-provider/manifest";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { MarcoPaso } from "./MarcoPaso";

interface PasoGrafemaProps {
  fonema: string;
  onSiguiente: () => void;
}

/** Paso 1: la letra y su sonido aislado. */
export function PasoGrafema({ fonema, onSiguiente }: PasoGrafemaProps) {
  const proveedor = useProveedorAudio();
  const tieneAudio = FONEMAS_CON_AUDIO_AISLADO.has(fonema);

  useEffect(() => {
    if (!tieneAudio) return;
    const temporizador = setTimeout(() => {
      void proveedor.play(claveAudio(fonema, fonema));
    }, 400);
    return () => clearTimeout(temporizador);
  }, [fonema, proveedor, tieneAudio]);

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("grafema")} · Grafema`}
      indicacion={`Hau ${fonema} letra da. Entzun eta errepikatu.`}
      onSiguiente={onSiguiente}
    >
      <div className="flex flex-col items-center gap-6">
        <span className="trazo-entrada font-lectura text-[clamp(6rem,22vw,14rem)] font-bold leading-none text-primary-700">
          {fonema}
        </span>
        <button
          type="button"
          disabled={!tieneAudio}
          onClick={() => void proveedor.play(claveAudio(fonema, fonema))}
          className="touch-target-lg flex items-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white px-5 text-neutral-700 disabled:opacity-40"
        >
          <IconoSoinua className="h-7 w-7" />
          Entzun
        </button>
      </div>
    </MarcoPaso>
  );
}
