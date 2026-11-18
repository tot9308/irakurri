"use client";

import { Button } from "@/components/ui/Button";
import { IconoCheck } from "@/components/ui/Iconos";

interface PasoFinProps {
  fonema: string;
  onRepetir: () => void;
  onMenu: () => void;
}

/** Cierre de la leccion: sin notas ni rankings, solo refuerzo y salida. */
export function PasoFin({ fonema, onRepetir, onMenu }: PasoFinProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <IconoCheck className="h-14 w-14" />
      </span>
      <h2 className="text-3xl font-bold text-emerald-800">Oso ondo!</h2>
      <p className="max-w-sm text-lg text-neutral-700">
        <strong>{fonema}</strong> letra landu duzu: silabak, hitzak eta irudiak.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={onRepetir}>
          Berriz hasi
        </Button>
        <Button onClick={onMenu}>Menua</Button>
      </div>
    </div>
  );
}
