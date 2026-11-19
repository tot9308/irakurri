"use client";

import { useEffect, useMemo } from "react";
import { claveSilaba } from "@/lib/audio-provider/manifest";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { barajar } from "@/lib/leccion/pasos";
import { useReproductorPractica } from "@/lib/leccion/useReproductorPractica";
import { MarcoPractica } from "./MarcoPractica";

interface PasoRepetirProps {
  fonema: string;
  silabas: readonly string[];
  onSiguiente: () => void;
}

/** Paso 3: primero las cinco silabas en orden y despues las mismas desordenadas. */
export function PasoRepetir({ fonema, silabas, onSiguiente }: PasoRepetirProps) {
  const proveedor = useProveedorAudio();

  const desordenadas = useMemo(() => barajar(silabas, 29), [silabas]);
  const secuencia = useMemo(() => [...silabas, ...desordenadas], [silabas, desordenadas]);

  useEffect(() => {
    proveedor.precargar(silabas.map((s) => claveSilaba(fonema, s)));
  }, [proveedor, fonema, silabas]);

  const reproductor = useReproductorPractica({
    elementos: secuencia,
    reproducir: async (s) => {
      const clave = claveSilaba(fonema, s);
      if (proveedor.disponible(clave)) {
        await proveedor.play(clave);
        return;
      }
      await new Promise((resolver) => setTimeout(resolver, 500));
    },
    proveedor,
    pausaBaseMs: 800,
  });

  const enSegunda = reproductor.indice >= silabas.length;
  const visibles = enSegunda ? desordenadas : silabas;
  const activa =
    reproductor.fase === "presentando" || reproductor.fase === "pausado"
      ? (secuencia[reproductor.indice] ?? null)
      : null;

  const reproducirSuelta = (s: string) => {
    if (reproductor.fase === "presentando") return;
    const clave = claveSilaba(fonema, s);
    if (proveedor.disponible(clave)) void proveedor.play(clave);
  };

  return (
    <MarcoPractica
      titulo={`${indiceGlobal("errepikatu")} · Errepikatu`}
      indicacion="Lehenengo ordenan, gero nahastuta. Entzun eta errepikatu ozen."
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
      hechos={reproductor.fase === "inactivo" ? 0 : enSegunda ? 2 : 1}
      total={2}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {enSegunda ? "2 · Nahastuta" : "1 · Ordenean"}
        </p>
        <div className="flex w-full max-w-3xl flex-wrap justify-center">
          {visibles.map((s) => (
            <div key={s} className="flex w-[30%] items-center justify-center sm:w-[19%]">
              <button
                type="button"
                onClick={() => reproducirSuelta(s)}
                aria-label={`Silaba ${s}. Sakatu entzuteko.`}
                className={`font-lectura text-[clamp(2.2rem,6vw,3.25rem)] font-bold leading-none transition-[transform,color] duration-300 ${
                  activa === s ? "scale-150 text-primary-700" : "scale-100 text-neutral-700"
                }`}
              >
                {s}
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {activa ?? ""}
      </p>
    </MarcoPractica>
  );
}
