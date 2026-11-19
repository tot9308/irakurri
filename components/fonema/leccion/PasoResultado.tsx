"use client";

import { Button } from "@/components/ui/Button";
import { IconoEstrella } from "@/components/ui/Iconos";
import { estrellas, mensajeResultado } from "@/lib/leccion/resultado";

interface PasoResultadoProps {
  titulo: string;
  aciertos: number;
  total: number;
  esUltimo: boolean;
  onSiguiente: () => void;
  onMenu: () => void;
  onRepetir: () => void;
}

/** Pantalla de cierre de un ejercicio evaluado: estrellas + salida. */
export function PasoResultado({
  titulo,
  aciertos,
  total,
  esUltimo,
  onSiguiente,
  onMenu,
  onRepetir,
}: PasoResultadoProps) {
  const valor = estrellas(aciertos, total);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {titulo}
      </p>

      <div
        role="img"
        aria-label={`${valor} izar`}
        className="flex items-center gap-2"
      >
        {[1, 2, 3].map((posicion) => (
          <IconoEstrella
            key={posicion}
            className={`h-14 w-14 ${
              posicion <= valor ? "text-amber-400" : "text-neutral-200"
            }`}
          />
        ))}
      </div>

      <h2 className="text-3xl font-bold text-neutral-800">{mensajeResultado(valor)}</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {esUltimo ? (
          <Button onClick={onRepetir}>Berriz hasi</Button>
        ) : (
          <Button onClick={onSiguiente}>Hurrengo ariketa</Button>
        )}
        <Button variant="secondary" onClick={onMenu}>
          Menua
        </Button>
      </div>
    </div>
  );
}
