"use client";

import { useEffect } from "react";
import { claveAudio } from "@/lib/audio-provider/manifest";
import { reproducirSilabas } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { PSEUDOPALABRAS, silabasDePseudopalabra } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { useReproductorPractica } from "@/lib/leccion/useReproductorPractica";
import { MarcoPractica } from "./MarcoPractica";

interface PasoEscucharPseudosProps {
  fonema: string;
  onSiguiente: () => void;
}

/** Paso 6: una pseudopalabra cada vez; suena, se lee y avanza sola. */
export function PasoEscucharPseudos({ fonema, onSiguiente }: PasoEscucharPseudosProps) {
  const proveedor = useProveedorAudio();

  useEffect(() => {
    proveedor.precargar(PSEUDOPALABRAS.map((p) => claveAudio("pseudohitzak", p)));
  }, [proveedor]);

  const reproductor = useReproductorPractica({
    elementos: PSEUDOPALABRAS,
    reproducir: async (p) => {
      const clave = claveAudio("pseudohitzak", p);
      if (proveedor.disponible(clave)) {
        await proveedor.play(clave);
        return;
      }
      await reproducirSilabas(proveedor, fonema, silabasDePseudopalabra(p));
    },
    proveedor,
    pausaBaseMs: 1000,
  });

  const actual =
    reproductor.fase === "inactivo"
      ? PSEUDOPALABRAS[0]
      : (PSEUDOPALABRAS[reproductor.indice] ?? PSEUDOPALABRAS[0]);
  const hechos =
    reproductor.fase === "inactivo"
      ? 0
      : Math.min(reproductor.indice + 1, PSEUDOPALABRAS.length);

  return (
    <MarcoPractica
      titulo={`${indiceGlobal("pseudo")} · Entzun pseudohitzak`}
      indicacion="Entzun eta irakurri ozen. Ez da benetako hitza, baina silabak berdin irakurtzen dira."
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
      total={PSEUDOPALABRAS.length}
      etiquetaRepetir="pseudohitza"
      etiquetaSaltar="pseudohitzera"
      etiquetaTartea="Pseudohitzen arteko tartea"
    >
      <div className="flex flex-col items-center gap-4">
        <p
          key={actual}
          className="trazo-entrada font-lectura text-[clamp(3rem,10vw,6rem)] font-bold tracking-wide text-neutral-800"
        >
          {actual}
        </p>
        {reproductor.fase === "inactivo" && (
          <p className="text-sm text-neutral-500">Sakatu Hasi entzuteko.</p>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Pseudohitza: {actual}
      </p>
    </MarcoPractica>
  );
}
