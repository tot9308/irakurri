"use client";

import { useCallback, useEffect, useState } from "react";
import { reproducirSilaba } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { combinacionSilaba } from "@/lib/leccion/pasos";
import { indiceGlobal } from "@/lib/leccion/etapas";
import { MarcoPaso } from "./MarcoPaso";

interface PasoSilabakProps {
  fonema: string;
  silabas: readonly string[];
  onSiguiente: () => void;
}

/** Paso 2: sintesis explicita m + a = ma, vocal a vocal. */
export function PasoSilabak({ fonema, silabas, onSiguiente }: PasoSilabakProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const silaba = silabas[indice] ?? "";
  const partes = combinacionSilaba(fonema, silaba);

  const reproducir = useCallback(() => {
    if (!silaba) return;
    reproducirSilaba(proveedor, fonema, silaba);
  }, [proveedor, fonema, silaba]);

  useEffect(() => {
    const temporizador = setTimeout(reproducir, 350);
    return () => clearTimeout(temporizador);
  }, [reproducir]);

  const avanzar = () => {
    if (indice + 1 >= silabas.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPaso
      titulo={`${indiceGlobal("silabak")} · Silabak`}
      indicacion="Kontsonantea eta bokala elkartzen dira."
      onSiguiente={avanzar}
      textoBoton={indice + 1 >= silabas.length ? "Jarraitu" : "Hurrengo silaba"}
      hechos={indice + 1}
      total={silabas.length}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <span className="font-lectura text-[clamp(3rem,10vw,6rem)] font-bold leading-none text-neutral-800">
          {partes?.consonante}
        </span>
        <span className="text-[clamp(2rem,7vw,4rem)] leading-none text-neutral-400">+</span>
        <span className="font-lectura text-[clamp(3rem,10vw,6rem)] font-bold leading-none text-neutral-800">
          {partes?.vocal}
        </span>
        <span className="text-[clamp(2rem,7vw,4rem)] leading-none text-neutral-400">=</span>
        <button
          type="button"
          onClick={reproducir}
          aria-label={`Silaba ${silaba}`}
          className="ficha-entrada flex h-[clamp(96px,18vw,150px)] w-[clamp(96px,18vw,150px)] items-center justify-center rounded-3xl border-[3px] border-primary-700 bg-primary-700 font-lectura text-[clamp(2.6rem,9vw,5.5rem)] font-bold leading-none text-white active:scale-95"
        >
          {silaba}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {silaba}
      </p>
    </MarcoPaso>
  );
}
