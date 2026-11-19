"use client";

import { Button } from "@/components/ui/Button";
import { IconoCheck, IconoImagen, IconoRepetir } from "@/components/ui/Iconos";
import { ETAPAS, indiceGlobal, type ColorEtapa } from "@/lib/leccion/etapas";
import { ETIQUETAS_CORTAS, PASOS, type PasoId } from "@/lib/leccion/pasos";

interface SelectorEjercicioProps {
  fonema: string;
  pasosCompletados: string[];
  secuenciaCompletada: boolean;
  palabrasHechas: number;
  totalPalabras: number;
  onLeccion: (paso: PasoId) => void;
  onSecuencia: () => void;
  onPalabras: () => void;
  onAtras: () => void;
}

const ESTILOS: Record<
  ColorEtapa,
  { borde: string; fondo: string; texto: string; insignia: string }
> = {
  primary: {
    borde: "border-primary-300",
    fondo: "bg-primary-50",
    texto: "text-primary-800",
    insignia: "bg-primary-700",
  },
  amber: {
    borde: "border-amber-300",
    fondo: "bg-amber-50",
    texto: "text-amber-900",
    insignia: "bg-amber-600",
  },
  emerald: {
    borde: "border-emerald-300",
    fondo: "bg-emerald-50",
    texto: "text-emerald-900",
    insignia: "bg-emerald-600",
  },
};

/**
 * Menu por etapas (opcion C: por dificultad): Hasi, Finkatu, Erabili.
 * Todos los botones visibles; los pasos conservan su numeracion global 1..8.
 */
export function SelectorEjercicio({
  fonema,
  pasosCompletados,
  secuenciaCompletada,
  palabrasHechas,
  totalPalabras,
  onLeccion,
  onSecuencia,
  onPalabras,
  onAtras,
}: SelectorEjercicioProps) {
  const sinPalabras = totalPalabras === 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col justify-center gap-5 p-4 sm:p-6">
      <header className="text-center">
        <h1 className="text-lg font-semibold text-neutral-600">Aukeratu ariketa</h1>
        <p className="mt-1 text-4xl font-bold text-primary-700">{fonema}</p>
        <p className="mt-1 text-xs font-semibold text-neutral-500">
          {pasosCompletados.length}/{PASOS.length} ikasita
        </p>
      </header>

      {ETAPAS.map((etapa, indiceEtapa) => {
        const estilos = ESTILOS[etapa.color];
        const hechos = etapa.pasos.filter((paso) => pasosCompletados.includes(paso)).length;

        return (
          <section key={etapa.id} aria-labelledby={`etapa-${etapa.id}`}>
            <h2
              id={`etapa-${etapa.id}`}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${estilos.texto}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${estilos.insignia}`}
              >
                {indiceEtapa + 1}
              </span>
              {etapa.nombre}
              <span className="ml-auto text-xs font-semibold normal-case text-neutral-500">
                {hechos}/{etapa.pasos.length}
              </span>
            </h2>
            <p className="mb-2 text-xs text-neutral-500">{etapa.descripcion}</p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {etapa.pasos.map((paso) => {
                const hecho = pasosCompletados.includes(paso);
                return (
                  <button
                    key={paso}
                    type="button"
                    onClick={() => onLeccion(paso)}
                    aria-label={`${indiceGlobal(paso)}. ${ETIQUETAS_CORTAS[paso]}`}
                    className={`flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2 text-center transition-colors active:scale-95 ${estilos.borde} ${estilos.fondo} ${
                      hecho ? "ring-1 ring-emerald-400" : ""
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                        hecho ? "bg-emerald-600" : estilos.insignia
                      }`}
                    >
                      {hecho ? <IconoCheck className="h-4 w-4" /> : indiceGlobal(paso)}
                    </span>
                    <span className={`text-sm font-semibold leading-tight ${estilos.texto}`}>
                      {ETIQUETAS_CORTAS[paso]}
                    </span>
                  </button>
                );
              })}
            </div>

            {etapa.id === "erabili" && (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onSecuencia}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors active:scale-[0.99] ${estilos.borde} ${estilos.fondo}`}
                >
                  <IconoRepetir className={`h-8 w-8 shrink-0 ${estilos.texto}`} />
                  <span className="flex flex-col">
                    <span className={`font-semibold ${estilos.texto}`}>Segida</span>
                    <span className="text-xs text-neutral-600">
                      Silabak bata bestearen atzetik
                    </span>
                  </span>
                  {secuenciaCompletada && (
                    <span className="ml-auto text-xs font-semibold text-emerald-700">
                      Eginda
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onPalabras}
                  disabled={sinPalabras}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 ${estilos.borde} ${estilos.fondo}`}
                >
                  <IconoImagen className={`h-8 w-8 shrink-0 ${estilos.texto}`} />
                  <span className="flex flex-col">
                    <span className={`font-semibold ${estilos.texto}`}>Hitzak</span>
                    <span className="text-xs text-neutral-600">
                      {sinPalabras ? "Audioa falta da" : "Osatu hitzak silabekin"}
                    </span>
                  </span>
                  {!sinPalabras && (
                    <span className="ml-auto text-xs font-semibold text-neutral-500">
                      {palabrasHechas}/{totalPalabras}
                    </span>
                  )}
                </button>
              </div>
            )}
          </section>
        );
      })}

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onAtras}>
          Atzera
        </Button>
      </div>
    </div>
  );
}

