"use client";

import { useCallback, useEffect, useState } from "react";
import { ConstructorPalabras } from "@/components/fonema/ConstructorPalabras";
import { Leccion } from "@/components/fonema/leccion/Leccion";
import { SecuenciaLetra } from "@/components/fonema/SecuenciaLetra";
import { SelectorEjercicio } from "@/components/fonema/SelectorEjercicio";
import { PASOS } from "@/lib/leccion/pasos";
import { palabrasConAudio } from "@/lib/palabras";
import { fonemasCompletados, leerProgreso } from "@/lib/progreso";

// Solo los fonemas con audio grabado en public/audio/v1.
const FONEMAS_CON_AUDIO = ["m"] as const;

type Paso = "fonema" | "menu" | "leccion" | "secuencia" | "palabras";

export default function InvitadoPage() {
  const [paso, setPaso] = useState<Paso>("fonema");
  const [fonema, setFonema] = useState("");
  const [completados, setCompletados] = useState<Record<string, boolean>>({});
  const [resumen, setResumen] = useState({ pasos: 0, palabras: 0 });

  const refrescarProgreso = useCallback(() => {
    setCompletados(fonemasCompletados());
    const registro = leerProgreso()[fonema];
    setResumen({
      pasos: registro?.pasosCompletados.length ?? 0,
      palabras: registro?.palabrasCompletadas.length ?? 0,
    });
  }, [fonema]);

  // Se relee al volver de un ejercicio para refrescar el progreso.
  useEffect(() => {
    if (paso === "fonema" || paso === "menu") refrescarProgreso();
  }, [paso, refrescarProgreso]);

  if (paso === "leccion") {
    return <Leccion fonema={fonema} onAtras={() => setPaso("menu")} />;
  }

  if (paso === "secuencia") {
    return (
      <SecuenciaLetra
        fonema={fonema}
        onAtras={() => setPaso("menu")}
        onSiguiente={() => setPaso("palabras")}
      />
    );
  }

  if (paso === "palabras") {
    return <ConstructorPalabras fonema={fonema} onAtras={() => setPaso("menu")} />;
  }

  if (paso === "menu") {
    return (
      <SelectorEjercicio
        fonema={fonema}
        pasosHechos={resumen.pasos}
        totalPasos={PASOS.length}
        secuenciaCompletada={completados[fonema] === true}
        palabrasHechas={resumen.palabras}
        totalPalabras={palabrasConAudio(fonema).length}
        onSelect={(ejercicio) => setPaso(ejercicio)}
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
                  setPaso("menu");
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
