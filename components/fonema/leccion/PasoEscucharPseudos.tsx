"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { claveAudio } from "@/lib/audio-provider/manifest";
import { reproducirSilabas } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { PSEUDOPALABRAS, silabasDePseudopalabra } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { MarcoPaso } from "./MarcoPaso";

interface PasoEscucharPseudosProps {
  fonema: string;
  onSiguiente: () => void;
}

/** Paso 6: solo audio. Se escucha y se repite en voz alta, sin texto a la vista. */
export function PasoEscucharPseudos({ fonema, onSiguiente }: PasoEscucharPseudosProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const pseudopalabra = PSEUDOPALABRAS[indice] ?? "";
  const clave = claveAudio("pseudohitzak", pseudopalabra);

  const reproducir = useCallback(() => {
    if (!pseudopalabra) return;
    if (proveedor.disponible(clave)) {
      void proveedor.play(clave);
      return;
    }
    void reproducirSilabas(proveedor, fonema, silabasDePseudopalabra(pseudopalabra));
  }, [proveedor, fonema, pseudopalabra, clave]);

  useEffect(() => {
    proveedor.precargar(PSEUDOPALABRAS.map((p) => claveAudio("pseudohitzak", p)));
  }, [proveedor]);

  useEffect(() => {
    const temporizador = setTimeout(reproducir, 300);
    return () => clearTimeout(temporizador);
  }, [reproducir]);

  const avanzar = () => {
    if (indice + 1 >= PSEUDOPALABRAS.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("pseudo")} · Entzun pseudohitzak`}
      indicacion="Entzun eta irakurri ozen. Ez da benetako hitza, baina silabak berdin irakurtzen dira."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={PSEUDOPALABRAS.length}
    >
      <div className="flex flex-col items-center gap-5">
        <p className="font-lectura text-[clamp(3rem,10vw,5.5rem)] font-bold tracking-wide text-neutral-800">
          {pseudopalabra}
        </p>
        <Button variant="secondary" onClick={reproducir}>
          <IconoSoinua className="mr-2 h-5 w-5" />
          Entzun
        </Button>
      </div>
    </MarcoPaso>
  );
}
