"use client";

import { useCallback, useEffect, useState } from "react";
import { IconoRepetir, IconoSoinua } from "@/components/ui/Iconos";
import { FichaSilaba } from "../FichaSilaba";
import { reproducirSilaba } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { rondasDeSilabas } from "@/lib/leccion/pasos";
import { AccionPractica, MarcoPractica } from "./MarcoPractica";

interface PasoRepetirProps {
  fonema: string;
  silabas: readonly string[];
  onSiguiente: () => void;
}

/** Paso 4: las silabas salen en orden no alfabetico; el nino las repite. */
export function PasoRepetir({ fonema, silabas, onSiguiente }: PasoRepetirProps) {
  const proveedor = useProveedorAudio();
  const [rondas] = useState(() => rondasDeSilabas(silabas, 8, 17));
  const [indice, setIndice] = useState(0);
  const [pulso, setPulso] = useState(0);
  const silaba = rondas[indice] ?? "";
  const vistas = new Set(rondas.slice(0, indice));

  const reproducirActual = useCallback(() => {
    if (!silaba) return;
    reproducirSilaba(proveedor, fonema, silaba);
    setPulso((actual) => actual + 1);
  }, [proveedor, fonema, silaba]);

  useEffect(() => {
    const temporizador = setTimeout(reproducirActual, 300);
    return () => clearTimeout(temporizador);
  }, [reproducirActual]);

  const reproducirOtra = (objetivo: string) => {
    reproducirSilaba(proveedor, fonema, objetivo);
  };

  const avanzar = () => {
    if (indice + 1 >= rondas.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPractica
      titulo={`${indiceGlobal("errepikatu")} · Errepikatu`}
      indicacion="Entzun silaba eta errepikatu ozen."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={rondas.length}
      controles={
        <>
          <AccionPractica etiqueta="Entzun" ariaLabel="Entzun silaba" onClick={reproducirActual}>
            <IconoSoinua className="h-8 w-8" />
          </AccionPractica>
          <AccionPractica
            etiqueta="Errepikatu"
            ariaLabel="Errepikatu silaba"
            onClick={reproducirActual}
          >
            <IconoRepetir className="h-8 w-8" />
          </AccionPractica>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {silabas.map((candidata) => (
          <FichaSilaba
            key={candidata}
            silaba={candidata}
            estado={
              candidata === silaba
                ? "activa"
                : vistas.has(candidata)
                  ? "completa"
                  : "atenuada"
            }
            pulsoVeces={candidata === silaba ? pulso : 0}
            onRepetir={() =>
              candidata === silaba ? reproducirActual() : reproducirOtra(candidata)
            }
            ariaLabel={`Silaba ${candidata}. Sakatu entzuteko.`}
          />
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {silaba}
      </p>
    </MarcoPractica>
  );
}
