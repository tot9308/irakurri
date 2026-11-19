"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { claveAudio } from "@/lib/audio-provider/manifest";
import { reproducirSilabas } from "@/lib/audio-provider/reproduccion";
import { useProveedorAudio } from "@/lib/audio-provider/useProveedorAudio";
import { PSEUDOPALABRAS, silabasDePseudopalabra } from "@/lib/leccion/pasos";
import { MarcoPaso } from "./MarcoPaso";

interface PasoPseudopalabrasProps {
  fonema: string;
  onSiguiente: () => void;
}

/** Paso 6: pseudopalabras CV para trabajar la decodificacion sin apoyo lexico. */
export function PasoPseudopalabras({ fonema, onSiguiente }: PasoPseudopalabrasProps) {
  const proveedor = useProveedorAudio();
  const [indice, setIndice] = useState(0);
  const pseudopalabra = PSEUDOPALABRAS[indice] ?? "";
  const clave = claveAudio("pseudohitzak", pseudopalabra);

  const reproducir = useCallback(() => {
    if (!pseudopalabra) return;
    // Si existe el audio generado, se usa tal cual (union con crossfade).
    if (proveedor.disponible(clave)) {
      void proveedor.play(clave);
      return;
    }
    void reproducirSilabas(proveedor, fonema, silabasDePseudopalabra(pseudopalabra));
  }, [proveedor, fonema, pseudopalabra, clave]);

  useEffect(() => {
    proveedor.precargar(PSEUDOPALABRAS.map((p) => claveAudio("pseudohitzak", p)));
  }, [proveedor]);

  useEffect(() => {
    const temporizador = setTimeout(reproducir, 300);
    return () => clearTimeout(temporizador);
  }, [reproducir]);

  const avanzar = () => {
    if (indice + 1 >= PSEUDOPALABRAS.length) onSiguiente();
    else setIndice(indice + 1);
  };

  return (
    <MarcoPaso
      titulo="6 · Pseudohitzak"
      indicacion="Entzun eta irakurri. Ez da benetako hitza, baina silabak berdin irakurtzen dira."
      onSiguiente={avanzar}
      hechos={indice + 1}
      total={PSEUDOPALABRAS.length}
    >
      <div className="flex flex-col items-center gap-5">
        <p className="text-[clamp(3rem,8vw,5rem)] font-bold tracking-wide text-neutral-800">
          {pseudopalabra}
        </p>
        <Button variant="secondary" onClick={reproducir}>
          <IconoSoinua className="mr-2 h-5 w-5" />
          Entzun
        </Button>
      </div>
    </MarcoPaso>
  );
}
