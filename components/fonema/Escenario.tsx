"use client";

import * as React from "react";

interface EscenarioProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Marco fijo del Stage: nunca cambia de tamano ni reordena al aparecer silabas.
 * Las posiciones se reservan desde el primer render (ver FichaSilaba).
 */
export function Escenario({ children, className }: EscenarioProps) {
  return (
    <div
      className={`relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-[28px] border-4 border-neutral-200 bg-neutral-100 p-4 sm:p-6 ${className ?? ""}`}
      style={{ minHeight: "clamp(260px, 44dvh, 540px)" }}
    >
      {children}
    </div>
  );
}
