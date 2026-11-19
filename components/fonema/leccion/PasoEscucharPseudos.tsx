"use client";

import { useCallback, useEffect, useState } from "react";
import { IconoRepetir, IconoSoinua } from "@/components/ui/Iconos";
import { claveAudio } from "@/lib/audio-provider/manifest";
import { reproducirSilabas } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { PSEUDOPALABRAS, silabasDePseudopalabra } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { FichaPractica } from "./FichaPractica";
import { AccionPractica, MarcoPractica } from "./MarcoPractica";

interface PasoEscucharPseudosProps {
  fonema: string;
  onSiguiente: () => void;
}

/** Paso 6: se escucha y se lee cada pseudopalabra; el conjunto queda a la vista. */
export function PasoEscucharPseudos({ fonema, onSiguiente }: PasoEscucharPseudosProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const pseudopalabra = PSEUDOPALABRAS[indice] ?? "";
  const vistas = new Set(PSEUDOPALABRAS.slice(0, indice));

  const reproducir = useCallback(
    (objetivo: string) => {
      if (!objetivo) return;
      const clave = claveAudio("pseudohitzak", objetivo);
      if (proveedor.disponible(clave)) {
        void proveedor.play(clave);
        return;
      }
      void reproducirSilabas(proveedor, fonema, silabasDePseudopalabra(objetivo));
    },
    [proveedor, fonema]
  );

  useEffect(() => {
    proveedor.precargar(PSEUDOPALABRAS.map((p) => claveAudio("pseudohitzak", p)));
  }, [proveedor]);

  useEffect(() => {
    const temporizador = setTimeout(() => reproducir(pseudopalabra), 300);
    return () => clearTimeout(temporizador);
  }, [pseudopalabra, reproducir]);

  const avanzar = () => {
    if (indice + 1 >= PSEUDOPALABRAS.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPractica
      titulo={`${indiceGlobal("pseudo")} · Entzun pseudohitzak`}
      indicacion="Entzun eta irakurri ozen. Ez da benetako hitza, baina silabak berdin irakurtzen dira."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={PSEUDOPALABRAS.length}
      controles={
        <>
          <AccionPractica
            etiqueta="Entzun"
            ariaLabel="Entzun"
            onClick={() => reproducir(pseudopalabra)}
          >
            <IconoSoinua className="h-8 w-8" />
          </AccionPractica>
          <AccionPractica
            etiqueta="Errepikatu"
            ariaLabel="Errepikatu pseudohitza"
            onClick={() => reproducir(pseudopalabra)}
          >
            <IconoRepetir className="h-8 w-8" />
          </AccionPractica>
        </>
      }
    >
      <div className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {PSEUDOPALABRAS.map((p, posicion) => (
          <FichaPractica
            key={p}
            estado={
              posicion === indice
                ? "activa"
                : vistas.has(p)
                  ? "completa"
                  : "pendiente"
            }
            onClick={() => reproducir(p)}
            ariaLabel={`${p}. Sakatu entzuteko.`}
            className="min-h-[76px] rounded-2xl px-3 font-lectura text-[clamp(1.4rem,4vw,2.4rem)] font-bold"
          >
            {p}
          </FichaPractica>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Pseudohitza: {pseudopalabra}
      </p>
    </MarcoPractica>
  );
}
