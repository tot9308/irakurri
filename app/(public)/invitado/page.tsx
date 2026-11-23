"use client";

import { useCallback, useEffect, useState } from "react";
import { ConstructorPalabras } from "@/components/fonema/ConstructorPalabras";
import { Leccion } from "@/components/fonema/leccion/Leccion";
import { SecuenciaLetra } from "@/components/fonema/SecuenciaLetra";
import { SelectorEjercicio } from "@/components/fonema/SelectorEjercicio";
import { LeccionVocales } from "@/components/fonema/vocales/LeccionVocales";
import { Button } from "@/components/ui/Button";
import { fonemasConAudio } from "@/lib/audio-provider/manifest";
import type { PasoId } from "@/lib/leccion/pasos";
import { palabrasParaConstruir } from "@/lib/palabras";
import { fonemasCompletados, leerProgreso } from "@/lib/progreso";

// Solo aparecen los fonemas con audio grabado en public/audio/v1.
const FONEMAS_CON_AUDIO = fonemasConAudio();

type Paso = "fonema" | "menu" | "leccion" | "secuencia" | "palabras" | "bokalek";

export default function InvitadoPage() {
  const [paso, setPaso] = useState<Paso>("fonema");
  const [fonema, setFonema] = useState("");
  const [completados, setCompletados] = useState<Record<string, boolean>>({});
  const [resumen, setResumen] = useState<{ pasos: string[]; palabras: number }>({
    pasos: [],
    palabras: 0,
  });
  const [pasoInicial, setPasoInicial] = useState<PasoId | undefined>(undefined);

  const refrescarProgreso = useCallback(() => {
    setCompletados(fonemasCompletados());
    const registro = leerProgreso()[fonema];
    setResumen({
      pasos: registro?.pasosCompletados ?? [],
      palabras: registro?.palabrasCompletadas.length ?? 0,
    });
  }, [fonema]);

  // Se relee al volver de un ejercicio para refrescar el progreso.
  useEffect(() => {
    if (paso === "fonema" || paso === "menu") refrescarProgreso();
  }, [paso, refrescarProgreso]);

  if (paso === "bokalek") {
    return <LeccionVocales onAtras={() => setPaso("fonema")} />;
  }

  if (paso === "leccion") {
    return (
      <Leccion
        fonema={fonema}
        pasoInicial={pasoInicial}
        onAtras={() => {
          setPasoInicial(undefined);
          setPaso("menu");
        }}
      />
    );
  }

  if (paso === "secuencia") {
    return (
      <SecuenciaLetra
        fonema={fonema}
        onAtras={() => setPaso("menu")}
        onSiguiente={() => {
          setPasoInicial("errepikatu");
          setPaso("leccion");
        }}
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
        pasosCompletados={resumen.pasos}
        secuenciaCompletada={completados[fonema] === true}
        palabrasHechas={resumen.palabras}
        totalPalabras={palabrasParaConstruir(fonema).length}
        onLeccion={(pasoLeccion) => {
          setPasoInicial(pasoLeccion);
          setPaso("leccion");
        }}
        onSecuencia={() => setPaso("secuencia")}
        onPalabras={() => setPaso("palabras")}
        onAtras={() => setPaso("fonema")}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center gap-4 p-6">
      <section className="card border-amber-200 bg-amber-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Lehenengo
            </p>
            <h2 className="text-2xl font-bold text-amber-900">Bokalek</h2>
            <p className="font-lectura text-2xl font-bold tracking-[0.25em] text-amber-800">
              a e i o u
            </p>
            <p className="mt-1 text-sm text-neutral-600">Letrak, soinuak eta trazoa.</p>
          </div>
          <Button size="lg" onClick={() => setPaso("bokalek")}>
            Hasi bokalekin
          </Button>
        </div>
      </section>

      <section className="card">
        <h1 className="mb-2 text-3xl font-bold">Kontsonanteak</h1>
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
                className="touch-target-lg w-full rounded-2xl border-2 border-neutral-300 bg-white font-lectura text-3xl font-bold text-neutral-800 transition-colors hover:border-primary-400 hover:bg-primary-50 active:scale-95"
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
      </section>
    </div>
  );
}
