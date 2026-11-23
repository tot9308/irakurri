"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { VOCALES, claveAudioVocal } from "@/lib/vocales";
import { Escenario } from "../Escenario";
import { Puntos } from "../leccion/MarcoPaso";
import { PizarraTrazo } from "./PizarraTrazo";
import { TrazoVocal } from "./TrazoVocal";

interface PasoLetrasVocalesProps {
  onSiguiente: () => void;
}

/**
 * Actividad 1: cada vocal se dibuja sola, se escucha y despues se repasa
 * en una pizarra libre (sin correccion automatica).
 */
export function PasoLetrasVocales({ onSiguiente }: PasoLetrasVocalesProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<"animacion" | "trazo">("animacion");
  const [repeticion, setRepeticion] = useState(0);

  const vocal = VOCALES[indice] ?? "a";
  const clave = claveAudioVocal(vocal);
  const disponible = proveedor.disponible(clave);
  const esUltima = indice === VOCALES.length - 1;

  useEffect(() => {
    if (fase !== "animacion") return;
    const temporizador = setTimeout(() => {
      if (disponible) void proveedor.play(clave);
    }, 500);
    return () => clearTimeout(temporizador);
  }, [vocal, fase, repeticion, disponible, clave, proveedor]);

  const repetirAnimacion = () => {
    setFase("animacion");
    setRepeticion((n) => n + 1);
  };

  const avanzar = () => {
    if (fase === "animacion") {
      setFase("trazo");
      return;
    }
    if (esUltima) {
      onSiguiente();
      return;
    }
    setIndice((n) => n + 1);
    setFase("animacion");
    setRepeticion((n) => n + 1);
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          1 · Bokalek: letra eta trazoa
        </p>
        <p className="text-lg text-neutral-700">
          {fase === "animacion"
            ? "Ikusi nola idazten den eta entzun soinua."
            : "Traza ezazu hatzarekin edo sagua."}
        </p>
      </div>

      <Escenario>
        {fase === "animacion" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="aspect-square w-[min(54vw,300px)]">
              <TrazoVocal
                vocal={vocal}
                modo="animado"
                repeticion={repeticion}
                className="h-full w-full"
              />
            </div>
            <p className="font-lectura text-5xl font-bold text-primary-700">{vocal}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (disponible) void proveedor.play(clave);
              }}
              disabled={!disponible}
            >
              <IconoSoinua className="mr-2 h-5 w-5" /> Entzun
            </Button>
          </div>
        ) : (
          <PizarraTrazo vocal={vocal} />
        )}
      </Escenario>

      <div className="flex flex-wrap justify-center gap-3">
        {fase === "animacion" ? (
          <Button size="lg" onClick={avanzar}>
            Traza ezazu
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={repetirAnimacion}>
              Ikusi berriro
            </Button>
            <Button size="lg" onClick={avanzar}>
              {esUltima ? "Amaitu" : "Hurrengo bokala"}
            </Button>
          </>
        )}
      </div>

      <Puntos hechos={fase === "trazo" ? indice + 1 : indice} total={VOCALES.length} />
      <p className="sr-only" role="status" aria-live="polite">
        {fase === "animacion" ? `${vocal} letra` : `${vocal} letra trazatzea`}
      </p>
    </div>
  );
}
