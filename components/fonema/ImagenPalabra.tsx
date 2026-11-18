"use client";

import { useState } from "react";
import { IconoImagen } from "@/components/ui/Iconos";
import { EXTENSIONES_IMAGEN, rutaImagenPalabra } from "@/lib/palabras";

interface ImagenPalabraProps {
  id: string;
  alt: string;
}

/**
 * Foto de la palabra con cadena de extensiones (webp -> png -> jpg -> svg).
 * Si no hay ninguna, muestra un placeholder neutro: el audio sigue disponible.
 */
export function ImagenPalabra({ id, alt }: ImagenPalabraProps) {
  const [intento, setIntento] = useState(0);

  if (intento >= EXTENSIONES_IMAGEN.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-neutral-400">
        <IconoImagen className="h-14 w-14" />
        <span className="text-xs font-semibold">Irudia laster</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={rutaImagenPalabra(id, EXTENSIONES_IMAGEN[intento])}
      alt={alt}
      className="h-full w-full object-contain"
      draggable={false}
      onError={() => setIntento((actual) => actual + 1)}
    />
  );
}
