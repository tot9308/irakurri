"use client";

import { useEffect, useMemo } from "react";
import { IconoSoinua } from "@/components/ui/Iconos";
import { ImagenPalabra } from "@/components/fonema/ImagenPalabra";
import {
  reproducirPalabra,
  reproducirSilaba,
} from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { anclaDeSilaba } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { claveAudioPalabra, textoPalabra, type Palabra } from "@/lib/palabras";
import { useReproductorPractica } from "@/lib/leccion/useReproductorPractica";
import { MarcoPractica } from "./MarcoPractica";
import { MarcoPaso } from "./MarcoPaso";

interface PasoAnclasProps {
  fonema: string;
  silabas: readonly string[];
  palabras: readonly Palabra[];
  onSiguiente: () => void;
}

/** Paso 4: cada silaba se ancla a una palabra; las palabras suenan en secuencia. */
export function PasoAnclas({ fonema, silabas, palabras, onSiguiente }: PasoAnclasProps) {
  const proveedor = useProveedorAudio();

  const anclas = useMemo(
    () =>
      silabas.flatMap((silaba) => {
        const palabra = anclaDeSilaba(silaba, palabras);
        return palabra ? [{ silaba, palabra }] : [];
      }),
    [silabas, palabras]
  );

  useEffect(() => {
    proveedor.precargar(anclas.map(({ palabra }) => claveAudioPalabra(palabra)));
  }, [proveedor, anclas]);

  const reproductor = useReproductorPractica({
    elementos: anclas,
    reproducir: async ({ palabra }) => {
      await reproducirPalabra(proveedor, palabra);
    },
    proveedor,
    pausaBaseMs: 1200,
  });

  const actual =
    reproductor.fase === "inactivo"
      ? anclas[0]
      : (anclas[reproductor.indice] ?? anclas[0]);
  const hechos =
    reproductor.fase === "inactivo" ? 0 : Math.min(reproductor.indice + 1, anclas.length);

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
      fase={reproductor.fase}
      velocidad={reproductor.velocidad}
      onVelocidad={reproductor.cambiarVelocidad}
      onIniciar={reproductor.iniciar}
      onPausar={reproductor.pausar}
      onReanudar={reproductor.reanudar}
      onRepetir={reproductor.repetir}
      onSaltar={reproductor.saltar}
      onGelditu={reproductor.detener}
      onSiguiente={onSiguiente}
      hechos={hechos}
      total={anclas.length}
      etiquetaRepetir="hitza"
      etiquetaSaltar="hitzera"
      etiquetaTartea="Hitzen arteko tartea"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="aspect-square w-[min(44vw,220px)] overflow-hidden rounded-[28px] bg-white">
          <ImagenPalabra id={actual.palabra.id} alt={textoPalabra(actual.palabra)} />
        </div>
        <p
          key={actual.palabra.id}
          className="trazo-entrada font-lectura text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-none text-neutral-800"
        >
          {textoPalabra(actual.palabra)}
        </p>
        <button
          type="button"
          onClick={() => {
            if (reproductor.fase !== "presentando") {
              reproducirSilaba(proveedor, fonema, actual.silaba);
            }
          }}
          aria-label={`Entzun silaba ${actual.silaba}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700"
        >
          <IconoSoinua className="h-4 w-4" /> {actual.silaba}
        </button>
        {reproductor.fase === "inactivo" && (
          <p className="text-sm text-neutral-500">Sakatu Hasi entzuteko.</p>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Hitza: {textoPalabra(actual.palabra)}
      </p>
    </MarcoPractica>
  );
}
