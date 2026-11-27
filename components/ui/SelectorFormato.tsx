import {
  FORMATOS_TEXTO,
  type FormatoTexto,
} from "@/lib/formato-texto";

interface SelectorFormatoProps {
  formato: FormatoTexto;
  onCambiar: (formato: FormatoTexto) => void;
}

/** Selector compacto y accesible del formato de lectura. */
export function SelectorFormato({ formato, onCambiar }: SelectorFormatoProps) {
  return (
    <div
      role="group"
      aria-label="Letra formatua"
      className="inline-flex rounded-xl border-2 border-neutral-200 bg-white p-1"
    >
      {FORMATOS_TEXTO.map((opcion) => (
        <button
          key={opcion.id}
          type="button"
          onClick={() => onCambiar(opcion.id)}
          aria-pressed={formato === opcion.id}
          className={`touch-target rounded-lg px-3 text-xs font-semibold transition-colors ${
            formato === opcion.id
              ? "bg-primary-700 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
