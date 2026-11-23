"use client";

import { useEffect } from "react";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { useReproductorPractica } from "@/lib/leccion/useReproductorPractica";
import {
  claveAudioPalabraVocal,
  claveAudioVocal,
  type PalabraVocal,
} from "@/lib/vocales";
import { MarcoPractica } from "../leccion/MarcoPractica";

interface PasoRepetirVocalPalabraProps {
  palabras: readonly PalabraVocal[];
  onSiguiente: () => void;
}

/**
 * Actividad 2: suena la letra y despues la palabra; el nino repite en voz alta.
 * Usa el mismo reproductor que Segida (play/pausa, stop, repetir, saltar, velocidad).
 */
export function PasoRepetirVocalPalabra({
  palabras,
  onSiguiente,
}: PasoRepetirVocalPalabraProps) {
  const proveedor = useProveedorAudio();

  useEffect(() => {
    proveedor.precargar(
      palabras.flatMap((palabra) => [
        claveAudioVocal(palabra.vocal),
        claveAudioPalabraVocal(palabra.id),
      ])
    );
  }, [proveedor, palabras]);

  const reproductor = useReproductorPractica({
    elementos: palabras,
    reproducir: async (palabra) => {
      const claveLetra = claveAudioVocal(palabra.vocal);
      if (proveedor.disponible(claveLetra)) await proveedor.play(claveLetra);
      const clavePalabra = claveAudioPalabraVocal(palabra.id);
      if (proveedor.disponible(clavePalabra)) await proveedor.play(clavePalabra);
    },
    proveedor,
    pausaBaseMs: 1100,
  });

  const actual =
    reproductor.fase === "inactivo"
      ? palabras[0]
      : (palabras[reproductor.indice] ?? palabras[0]);
  const hechos =
    reproductor.fase === "inactivo"
      ? 0
      : Math.min(reproductor.indice + 1, palabras.length);

  if (!actual) return null;

  return (
    <MarcoPractica
      titulo="2 · Errepikatu: letra + hitza"
      indicacion="Entzun letra eta hitza, eta errepikatu ozen."
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
      total={palabras.length}
      etiquetaRepetir="bikotea"
      etiquetaSaltar="bikotera"
      etiquetaTartea="Bikoteen arteko tartea"
      textoSiguiente="Menua"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Letra + hitza
        </p>
        <p
          key={`letra-${actual.vocal}`}
          className="font-lectura text-[clamp(4rem,14vw,7rem)] font-bold leading-none text-primary-700"
        >
          {actual.vocal}
        </p>
        <p
          key={`palabra-${actual.id}`}
          className="font-lectura text-[clamp(2rem,7vw,3.5rem)] font-bold leading-tight text-neutral-800"
        >
          {actual.id}
        </p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {actual.vocal}, {actual.id}
      </p>
    </MarcoPractica>
  );
}
