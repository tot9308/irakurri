"use client";

import { Button } from "@/components/ui/Button";
import { IconoSoinua } from "@/components/ui/Iconos";
import { textoPalabra, type Palabra } from "@/lib/palabras";
import { ImagenPalabra } from "./ImagenPalabra";

interface ObjetivoPalabraProps {
  palabra: Palabra;
  onEscuchar: () => void;
}

/** Palabra objetivo: solo imagen + audio. Nunca se escribe antes de resolverla. */
export function ObjetivoPalabra({ palabra, onEscuchar }: ObjetivoPalabraProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="aspect-square w-full max-w-[190px] overflow-hidden rounded-3xl border-4 border-neutral-200 bg-white">
        <ImagenPalabra id={palabra.id} alt={textoPalabra(palabra)} />
      </div>
      <Button variant="secondary" onClick={onEscuchar} aria-label="Entzun hitza">
        <IconoSoinua className="mr-2 h-6 w-6" />
        Entzun hitza
      </Button>
    </div>
  );
}
