"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { ImagenPalabra } from "@/components/fonema/ImagenPalabra";
import {
  reproducirPalabra,
  reproducirSilaba,
} from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { anclaDeSilaba } from "@/lib/leccion/pasos";
import { textoPalabra, type Palabra } from "@/lib/palabras";
import { MarcoPaso } from "./MarcoPaso";

interface PasoAnclasProps {
  fonema: string;
  silabas: readonly string[];
  palabras: readonly Palabra[];
  onSiguiente: () => void;
}

/** Paso 3: cada silaba se ancla a una palabra que empieza por ella. */
export function PasoAnclas({ fonema, silabas, palabras, onSiguiente }: PasoAnclasProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);

  const anclas = useMemo(
    () =>
      silabas.flatMap((silaba) => {
        const palabra = anclaDeSilaba(silaba, palabras);
        return palabra ? [{ silaba, palabra }] : [];
      }),
    [silabas, palabras]
  );

  const actual = anclas[indice];

  useEffect(() => {
    if (!actual) return;
    const temporizador = setTimeout(() => {
      void reproducirPalabra(proveedor, actual.palabra);
    }, 350);
    return () => clearTimeout(temporizador);
  }, [actual, proveedor]);

  const avanzar = () => {
    if (indice + 1 >= anclas.length) onSiguiente();
    else setIndice(indice + 1);
  };

  if (!actual) {
    return (
      <MarcoPaso
        titulo="3 · Hitza"
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
      titulo="3 · Hitza"
      indicacion={`${actual.silaba} silabarekin hasten den hitza`}
      onSiguiente={avanzar}
      textoBoton={indice + 1 >= anclas.length ? "Jarraitu" : "Hurrengo hitza"}
      hechos={indice + 1}
      total={anclas.length}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
        <div className="aspect-square w-[min(42vw,190px)] overflow-hidden rounded-3xl border-4 border-neutral-200 bg-white">
          <ImagenPalabra id={actual.palabra.id} alt={textoPalabra(actual.palabra)} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl font-bold text-neutral-800">{textoPalabra(actual.palabra)}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => void reproducirPalabra(proveedor, actual.palabra)}
            >
              <IconoSoinua className="mr-2 h-5 w-5" />
              Hitza
            </Button>
            <Button
              variant="secondary"
              onClick={() => reproducirSilaba(proveedor, fonema, actual.silaba)}
            >
              {actual.silaba}
            </Button>
          </div>
        </div>
      </div>
    </MarcoPaso>
  );
}
