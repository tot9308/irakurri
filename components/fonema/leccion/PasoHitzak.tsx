"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { ImagenPalabra } from "@/components/fonema/ImagenPalabra";
import { reproducirPalabra } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { textoPalabra, type Palabra } from "@/lib/palabras";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { MarcoPaso } from "./MarcoPaso";

interface PasoHitzakProps {
  palabras: readonly Palabra[];
  onSiguiente: () => void;
}

/** Paso 7: palabra escrita + foto + audio; el nino la lee en voz alta. */
export function PasoHitzak({ palabras, onSiguiente }: PasoHitzakProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const palabra = palabras[indice];

  useEffect(() => {
    if (!palabra) return;
    const temporizador = setTimeout(() => {
      void reproducirPalabra(proveedor, palabra);
    }, 350);
    return () => clearTimeout(temporizador);
  }, [palabra, proveedor]);

  const avanzar = () => {
    if (indice + 1 >= palabras.length) onSiguiente();
    else setIndice(indice + 1);
  };

  if (!palabra) {
    return (
      <MarcoPaso
        titulo={`${indiceGlobal("hitzak")} · Irakurri hitzak`}
        indicacion="Oraindik ez dago hitzik fonema honetarako."
        onSiguiente={onSiguiente}
      >
        <p className="max-w-sm text-center text-neutral-500">
          Gehitu hitz bat bere audioarekin eta hemen agertuko da.
        </p>
      </MarcoPaso>
    );
  }

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("hitzak")} · Irakurri hitzak`}
      indicacion="Irakurri hitza ozen. Gero entzun eta egiaztatu."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={palabras.length}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <div className="aspect-square w-[min(42vw,180px)] overflow-hidden rounded-3xl border-4 border-neutral-200 bg-white">
          <ImagenPalabra id={palabra.id} alt={textoPalabra(palabra)} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-wide text-neutral-800">
            {textoPalabra(palabra)}
          </p>
          <Button variant="secondary" onClick={() => void reproducirPalabra(proveedor, palabra)}>
            <IconoSoinua className="mr-2 h-5 w-5" />
            Entzun
          </Button>
        </div>
      </div>
    </MarcoPaso>
  );
}
