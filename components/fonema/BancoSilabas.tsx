"use client";

interface BancoSilabasProps {
  silabas: string[];
  deshabilitado: boolean;
  onColocar: (silaba: string) => void;
}

/** Banco de silabas sueltas: un toque coloca la silaba en el siguiente hueco. */
export function BancoSilabas({ silabas, deshabilitado, onColocar }: BancoSilabasProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="Silabak">
      {silabas.map((silaba) => (
        <button
          key={silaba}
          type="button"
          onClick={() => onColocar(silaba)}
          disabled={deshabilitado}
          aria-label={`Silaba ${silaba}`}
          className="flex h-[clamp(64px,7vw,84px)] w-[clamp(64px,7vw,84px)] items-center justify-center rounded-2xl border-[3px] border-neutral-300 bg-white text-[clamp(1.6rem,4.5vw,2.75rem)] font-bold leading-none text-neutral-800 transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          {silaba}
        </button>
      ))}
    </div>
  );
}
