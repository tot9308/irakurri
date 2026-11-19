"use client";

import { useEffect, useMemo, useState } from "react";
import { IconoSoinua } from "@/components/ui/Iconos";
import { ImagenPalabra } from "@/components/fonema/ImagenPalabra";
import {
  reproducirPalabra,
  reproducirSilaba,
} from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { anclaDeSilaba } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { textoPalabra, type Palabra } from "@/lib/palabras";
import { FichaPractica } from "./FichaPractica";
import { AccionPractica, MarcoPractica } from "./MarcoPractica";
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
        titulo={`${indiceGlobal("anclas")} · Hitza`}
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
    <MarcoPractica
      titulo={`${indiceGlobal("anclas")} · Hitza`}
      indicacion={`${actual.silaba} silabarekin hasten den hitza`}
      onSiguiente={avanzar}
      textoBoton={indice + 1 >= anclas.length ? "Jarraitu" : "Hurrengo hitza"}
      hechos={indice + 1}
      total={anclas.length}
      controles={
        <>
          <AccionPractica
            etiqueta="Hitza"
            ariaLabel="Entzun hitza"
            onClick={() => void reproducirPalabra(proveedor, actual.palabra)}
          >
            <IconoSoinua className="h-8 w-8" />
          </AccionPractica>
          <AccionPractica
            etiqueta={actual.silaba}
            ariaLabel={`Entzun silaba ${actual.silaba}`}
            onClick={() => reproducirSilaba(proveedor, fonema, actual.silaba)}
          >
            <IconoSoinua className="h-8 w-8" />
          </AccionPractica>
        </>
      }
    >
      <div className="grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {anclas.map(({ silaba, palabra }, posicion) => {
          const estado =
            posicion === indice
              ? "activa"
              : posicion < indice
                ? "completa"
                : "pendiente";
          return (
            <FichaPractica
              key={palabra.id}
              estado={estado}
              onClick={() => void reproducirPalabra(proveedor, palabra)}
              ariaLabel={`${textoPalabra(palabra)}. Sakatu hitza entzuteko.`}
              className="w-full flex-col gap-1 rounded-3xl p-2"
            >
              <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white">
                <ImagenPalabra id={palabra.id} alt={textoPalabra(palabra)} />
              </div>
              <span className="font-lectura text-[clamp(1rem,2.2vw,1.6rem)] font-bold leading-tight">
                {textoPalabra(palabra)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  estado === "activa"
                    ? "bg-white/20 text-white"
                    : "bg-primary-50 text-primary-700"
                }`}
              >
                {silaba}
              </span>
            </FichaPractica>
          );
        })}
      </div>
    </MarcoPractica>
  );
}
