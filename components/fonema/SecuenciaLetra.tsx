"use client";

import { Escenario } from "./Escenario";
import { FichaSilaba } from "./FichaSilaba";
import { MenuControles } from "./MenuControles";
import { IconoSoinua } from "@/components/ui/Iconos";
import { estadoFicha } from "@/lib/fonema/secuencia";
import { useSecuencia } from "@/lib/fonema/useSecuencia";

interface SecuenciaLetraProps {
  fonema: string;
  onAtras: () => void;
  onSiguiente?: () => void;
}

/**
 * Entorno unico para la letra: Stage fijo + controles externos.
 * El Stage reserva los 5 huecos desde el primer render, de modo que
 * las silabas aparecen sin mover nada (CLS 0).
 */
export function SecuenciaLetra({ fonema, onAtras, onSiguiente }: SecuenciaLetraProps) {
  const secuencia = useSecuencia(fonema);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAtras}
          className="touch-target flex items-center gap-1 rounded-xl px-2 text-sm font-semibold text-neutral-600"
        >
          <span aria-hidden="true">←</span> Atzera
        </button>

        <div className="flex items-center gap-1">
          <h1 className="flex items-baseline gap-2 text-lg font-semibold text-neutral-700">
            <span className="trazo-entrada inline-block font-lectura text-3xl font-bold text-primary-700">
              {fonema}
            </span>
            fonema
          </h1>
          {secuencia.tieneFonemaAislado && (
            <button
              type="button"
              onClick={secuencia.reproducirFonema}
              aria-label="Entzun fonema"
              className="touch-target rounded-xl px-2 text-primary-700 active:scale-95"
            >
              <IconoSoinua className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5" aria-hidden="true">
          {secuencia.silabas.map((silaba, posicion) => (
            <span
              key={silaba}
              className={`h-2.5 w-2.5 rounded-full ${
                posicion < secuencia.mostradas ? "bg-primary-600" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
        <main className="flex flex-1 flex-col">
          <Escenario>
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                {secuencia.silabas.map((silaba, posicion) => (
                  <FichaSilaba
                    key={silaba}
                    silaba={silaba}
                    estado={estadoFicha(
                      secuencia.fase,
                      secuencia.indice,
                      posicion,
                      secuencia.silabas.length
                    )}
                    pulsoVeces={
                      secuencia.pulso.posicion === posicion ? secuencia.pulso.veces : 0
                    }
                    onRepetir={() => secuencia.reproducirSilaba(posicion)}
                  />
                ))}
              </div>

              {secuencia.mostradas === 0 && (
                <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-lg text-neutral-500">
                  Sakatu <strong className="mx-1 text-neutral-700">Hasi</strong> silabak
                  entzuteko.
                </p>
              )}
            </div>
          </Escenario>

          <p className="sr-only" role="status" aria-live="polite">
            {secuencia.silabaActual}
          </p>
        </main>

        <MenuControles
          fase={secuencia.fase}
          velocidad={secuencia.velocidad}
          onVelocidad={secuencia.cambiarVelocidad}
          onIniciar={secuencia.iniciar}
          onPausar={secuencia.pausar}
          onReanudar={secuencia.reanudar}
          onRepetir={secuencia.repetir}
          onSaltar={secuencia.saltar}
          onGelditu={secuencia.detener}
          onSiguiente={() => onSiguiente?.()}
        />
      </div>
    </div>
  );
}
