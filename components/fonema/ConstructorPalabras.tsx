"use client";

import { Button } from "@/components/ui/Button";
import { useConstructor } from "@/lib/fonema/useConstructor";
import { textoPalabra } from "@/lib/palabras";
import { BancoSilabas } from "./BancoSilabas";
import { Escenario } from "./Escenario";
import { ObjetivoPalabra } from "./ObjetivoPalabra";
import { ZonaEnsamblaje } from "./ZonaEnsamblaje";

interface ConstructorPalabrasProps {
  fonema: string;
  onAtras: () => void;
}

/**
 * Entorno B: el nino oye la palabra (imagen + audio) y la construye con silabas.
 * Solo se escribe la palabra al resolverla, para no convertir el ejercicio en copia.
 */
export function ConstructorPalabras({ fonema, onAtras }: ConstructorPalabrasProps) {
  const juego = useConstructor(fonema);

  if (juego.sinPalabras) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-lg text-neutral-600">
          Oraindik ez dago hitzik fonema honetarako.
        </p>
        <Button variant="secondary" onClick={onAtras}>
          Atzera
        </Button>
      </div>
    );
  }

  const { palabra, estado } = juego;
  const correcto = estado.fase === "correcto";
  const error = estado.fase === "error";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAtras}
          className="touch-target flex items-center gap-1 rounded-xl px-2 text-sm font-semibold text-neutral-600"
        >
          <span aria-hidden="true">←</span> Atzera
        </button>

        <h1 className="flex items-baseline gap-2 text-lg font-semibold text-neutral-700">
          <span className="text-3xl font-bold text-primary-700">{fonema}</span>
          hitzak
        </h1>

        <span className="text-sm font-semibold text-neutral-500">
          {juego.indice + 1}/{juego.total}
        </span>
      </header>

      <main className="flex flex-1 flex-col gap-4">
        <Escenario>
          <div className="grid w-full items-center gap-5 sm:grid-cols-[minmax(150px,210px)_1fr]">
            {palabra && (
              <ObjetivoPalabra
                palabra={palabra}
                onEscuchar={() => void juego.reproducirPalabra()}
              />
            )}

            <div className="flex flex-col items-center gap-5">
              <ZonaEnsamblaje
                total={palabra?.silabas.length ?? 0}
                colocadas={estado.colocadas}
                fase={estado.fase}
                onQuitar={juego.quitarSilaba}
              />
              <BancoSilabas
                silabas={juego.banco}
                deshabilitado={correcto}
                onColocar={juego.colocarSilaba}
              />
            </div>
          </div>
        </Escenario>

        <p
          role="status"
          aria-live="polite"
          className={`min-h-6 text-center text-lg font-semibold ${
            correcto ? "text-emerald-700" : error ? "text-rose-700" : "text-transparent"
          }`}
        >
          {correcto ? "Oso ondo!" : error ? "Saiatu berriro" : "·"}
        </p>

        {correcto && palabra && (
          <p className="font-lectura text-center text-2xl font-bold tracking-wide text-neutral-800">
            {textoPalabra(palabra)}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="secondary"
            onClick={juego.vaciarTodo}
            disabled={estado.colocadas.length === 0 || correcto}
          >
            Garbitu
          </Button>
          <Button variant="primary" onClick={juego.siguientePalabra} disabled={!correcto}>
            Hurrengo hitza
          </Button>
        </div>
      </main>
    </div>
  );
}
