"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import type { LetraEdelfontmed } from "@/lib/glifos-edelfontmed";
import { PASOS_TRAZO_VOCALES } from "@/lib/pasos-trazo-vocales";
import { VOCALES, claveAudioVocal } from "@/lib/vocales";
import { Escenario } from "../Escenario";
import { Puntos } from "../leccion/MarcoPaso";
import { PizarraTrazo } from "./PizarraTrazo";
import { TrazoVocal, type CasoLetra } from "./TrazoVocal";

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
  const [fase, setFase] = useState<"pasos" | "trazo">("pasos");
  const [pasoActivo, setPasoActivo] = useState(1);
  const [caso, setCaso] = useState<CasoLetra>("minuscula");

  const vocal = VOCALES[indice] ?? "a";
  const letra = (caso === "mayuscula"
    ? vocal.toUpperCase()
    : vocal) as LetraEdelfontmed;
  const pasos = PASOS_TRAZO_VOCALES[letra];
  const clave = claveAudioVocal(vocal);
  const disponible = proveedor.disponible(clave);
  const esUltima = indice === VOCALES.length - 1;

  const cambiarCaso = (nuevo: CasoLetra) => {
    if (nuevo === caso) return;
    setCaso(nuevo);
    setFase("pasos");
    setPasoActivo(1);
  };

  useEffect(() => {
    if (fase !== "pasos") return;
    const temporizador = setTimeout(() => {
      if (disponible) void proveedor.play(clave);
    }, 500);
    return () => clearTimeout(temporizador);
  }, [vocal, fase, disponible, clave, proveedor]);

  const avanzar = () => {
    if (fase === "pasos") {
      setFase("trazo");
      return;
    }
    if (esUltima) {
      onSiguiente();
      return;
    }
    setIndice((n) => n + 1);
    setFase("pasos");
    setPasoActivo(1);
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          1 · Bokalek: letra eta trazoa
        </p>
        <p className="text-lg text-neutral-700">
          {fase === "pasos"
            ? "Ikusi urratsak eta entzun soinua."
            : "Traza ezazu hatzarekin edo sagua."}
        </p>
        <div
          role="group"
          aria-label="Letra mota"
          className="mt-2 inline-flex rounded-xl border-2 border-neutral-200 bg-white p-1"
        >
          <button
            type="button"
            onClick={() => cambiarCaso("minuscula")}
            aria-pressed={caso === "minuscula"}
            className={`touch-target rounded-lg px-4 text-sm font-semibold transition-colors ${
              caso === "minuscula"
                ? "bg-primary-700 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Minuskula
          </button>
          <button
            type="button"
            onClick={() => cambiarCaso("mayuscula")}
            aria-pressed={caso === "mayuscula"}
            className={`touch-target rounded-lg px-4 text-sm font-semibold transition-colors ${
              caso === "mayuscula"
                ? "bg-primary-700 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Maiuskula
          </button>
        </div>
      </div>

      <Escenario>
        {fase === "pasos" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="aspect-square w-[min(54vw,300px)]">
              <TrazoVocal
                vocal={vocal}
                caso={caso}
                modo="pasos"
                pasoActivo={pasoActivo}
                className="h-full w-full"
              />
            </div>
            <p className="font-lectura text-4xl font-normal text-primary-700">{letra}</p>
            <div
              role="group"
              aria-label="Trazoaren urratsak"
              className="inline-flex rounded-xl border-2 border-neutral-200 bg-white p-1"
            >
              {pasos.map((_, indicePaso) => {
                const numero = indicePaso + 1;
                return (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => setPasoActivo(numero)}
                    aria-pressed={pasoActivo === numero}
                    aria-label={`${numero}. urratsa`}
                    className={`touch-target rounded-lg px-3 text-sm font-semibold transition-colors ${
                      pasoActivo === numero
                        ? "bg-primary-700 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {numero}
                  </button>
                );
              })}
            </div>
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
          <PizarraTrazo vocal={vocal} caso={caso} />
        )}
      </Escenario>

      <div className="flex flex-wrap justify-center gap-3">
        {fase === "pasos" ? (
          <Button size="lg" onClick={avanzar}>
            Traza ezazu
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setFase("pasos")}>
              Urratsak
            </Button>
            <Button size="lg" onClick={avanzar}>
              {esUltima ? "Amaitu" : "Hurrengo bokala"}
            </Button>
          </>
        )}
      </div>

      <Puntos hechos={fase === "trazo" ? indice + 1 : indice} total={VOCALES.length} />
      <p className="sr-only" role="status" aria-live="polite">
        {fase === "pasos" ? `${letra} letraren urratsak` : `${letra} letra trazatzea`}
      </p>
    </div>
  );
}
