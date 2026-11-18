"use client";

import { useCallback, useEffect, useState } from "react";
import { ConstructorPalabras } from "@/components/fonema/ConstructorPalabras";
import { SecuenciaLetra } from "@/components/fonema/SecuenciaLetra";
import { SelectorEntorno } from "@/components/fonema/SelectorEntorno";
import { palabrasConAudio } from "@/lib/palabras";
import { fonemasCompletados } from "@/lib/progreso";

// Solo los fonemas con audio grabado en public/audio/v1.
const FONEMAS_CON_AUDIO = ["m"] as const;

type Paso = "fonema" | "entorno" | "secuencia" | "palabras";

export default function InvitadoPage() {
  const [paso, setPaso] = useState<Paso>("fonema");
  const [fonema, setFonema] = useState("");
  const [completados, setCompletados] = useState<Record<string, boolean>>({});

  const refrescarProgreso = useCallback(() => {
    setCompletados(fonemasCompletados());
  }, []);

  // Se relee al volver de un ejercicio para refrescar los "Eginda".
  useEffect(() => {
    if (paso === "fonema" || paso === "entorno") refrescarProgreso();
  }, [paso, refrescarProgreso]);

  if (paso === "secuencia") {
    return (
      <SecuenciaLetra
        fonema={fonema}
        onAtras={() => setPaso("entorno")}
        onSiguiente={() => setPaso("palabras")}
      />
    );
  }

  if (paso === "palabras") {
    return <ConstructorPalabras fonema={fonema} onAtras={() => setPaso("entorno")} />;
  }

  if (paso === "entorno") {
    return (
      <SelectorEntorno
        fonema={fonema}
        secuenciaCompletada={completados[fonema] === true}
        palabrasDisponibles={palabrasConAudio(fonema).length}
        onSelect={(entorno) => setPaso(entorno === "secuencia" ? "secuencia" : "palabras")}
        onAtras={() => setPaso("fonema")}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center p-6">
      <div className="card">
        <h1 className="mb-2 text-3xl font-bold">Aukeratu fonema</h1>
        <p className="mb-8 text-neutral-600">
          Oraingoz <strong>m</strong> fonema dago prest. Sakatu hasteko.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {FONEMAS_CON_AUDIO.map((p) => (
            <div key={p} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setFonema(p);
                  setPaso("entorno");
                }}
                className="touch-target-lg w-full rounded-2xl border-2 border-neutral-300 bg-white text-3xl font-bold text-neutral-800 transition-colors hover:border-primary-400 hover:bg-primary-50 active:scale-95"
              >
                {p}
              </button>
              <span
                aria-hidden={!completados[p]}
                className={`h-4 text-[11px] font-semibold ${
                  completados[p] ? "text-emerald-700" : "invisible"
                }`}
              >
                Eginda
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
