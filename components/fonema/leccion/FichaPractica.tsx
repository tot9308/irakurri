"use client";

import * as React from "react";

export type EstadoFichaPractica = "activa" | "completa" | "pendiente";

interface FichaPracticaProps {
  estado: EstadoFichaPractica;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

const ESTILOS: Record<EstadoFichaPractica, string> = {
  activa: "border-primary-700 bg-primary-700 text-white shadow-lg",
  completa: "border-neutral-300 bg-white text-neutral-800",
  pendiente: "border-neutral-200 bg-white text-neutral-500",
};

/**
 * Ficha generica de practica (silaba, pseudopalabra o palabra con foto).
 * La ficha actual se resalta; las ya vistas quedan neutras y las pendientes
 * se ven atenuadas, para que el nino vea el conjunto sin perder el foco.
 */
export function FichaPractica({
  estado,
  onClick,
  ariaLabel,
  className,
  children,
}: FichaPracticaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={estado === "activa" ? "true" : undefined}
      className={`ficha-entrada flex items-center justify-center border-[3px] transition-colors duration-200 active:scale-95 ${ESTILOS[estado]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
