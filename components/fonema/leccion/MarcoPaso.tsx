"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Escenario } from "../Escenario";

interface MarcoPasoProps {
  titulo: string;
  indicacion: string;
  children: React.ReactNode;
  onSiguiente: () => void;
  textoBoton?: string;
  deshabilitado?: boolean;
  hechos?: number;
  total?: number;
}

export function Puntos({ hechos, total }: { hechos: number; total: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }).map((_, indice) => (
        <span
          key={indice}
          className={`h-2.5 w-2.5 rounded-full ${
            indice < hechos ? "bg-primary-600" : "bg-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}

/** Marco comun de los pasos: instruccion, Stage fijo y boton de avance. */
export function MarcoPaso({
  titulo,
  indicacion,
  children,
  onSiguiente,
  textoBoton = "Jarraitu",
  deshabilitado = false,
  hechos = 0,
  total = 0,
}: MarcoPasoProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          {titulo}
        </p>
        <p className="text-lg text-neutral-700">{indicacion}</p>
      </div>

      <Escenario>{children}</Escenario>

      <div className="flex w-full flex-col items-center gap-3">
        {total > 0 && <Puntos hechos={hechos} total={total} />}
        <Button onClick={onSiguiente} disabled={deshabilitado} size="lg">
          {textoBoton}
        </Button>
      </div>
    </div>
  );
}
