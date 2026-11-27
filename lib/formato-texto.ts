/**
 * Formato de presentacion del texto de lectura.
 * `nahasia` alterna mayusculas y minusculas por letra, de forma determinista.
 */

export type FormatoTexto = "minuskula" | "maiuskula" | "nahasia";

export const FORMATOS_TEXTO: readonly { id: FormatoTexto; etiqueta: string }[] = [
  { id: "minuskula", etiqueta: "Minuskula" },
  { id: "maiuskula", etiqueta: "Maiuskula" },
  { id: "nahasia", etiqueta: "Nahasia" },
];

/** Clave versionada; si cambia el formato guardado, se ignora. */
export const CLAVE_FORMATO_TEXTO = "irakurri:formato:v1";

export function esFormatoTexto(valor: unknown): valor is FormatoTexto {
  return (
    typeof valor === "string" &&
    FORMATOS_TEXTO.some((formato) => formato.id === valor)
  );
}

/**
 * Aplica el formato a un texto.
 * - En `nahasia`, la primera letra es minuscula y despues alterna.
 * - Los espacios, guiones y signos no cuentan para la alternancia.
 * - `semilla` permite desfasar la alternancia en listas de opciones.
 */
export function formatearTexto(
  texto: string,
  formato: FormatoTexto,
  semilla = 0
): string {
  if (formato === "minuskula") return texto.toLocaleLowerCase("eu");
  if (formato === "maiuskula") return texto.toLocaleUpperCase("eu");

  let posicionLetra = 0;
  return Array.from(texto)
    .map((caracter) => {
      if (!/\p{L}/u.test(caracter)) return caracter;
      const mayuscula = (posicionLetra + semilla) % 2 === 1;
      posicionLetra += 1;
      return mayuscula
        ? caracter.toLocaleUpperCase("eu")
        : caracter.toLocaleLowerCase("eu");
    })
    .join("");
}

/** Lectura segura: SSR y almacenamiento no disponible devuelven minuscula. */
export function leerFormatoTexto(): FormatoTexto {
  if (typeof window === "undefined") return "minuskula";
  try {
    const guardado = window.localStorage.getItem(CLAVE_FORMATO_TEXTO);
    return esFormatoTexto(guardado) ? guardado : "minuskula";
  } catch {
    return "minuskula";
  }
}

/** Persistencia tolerante a cuota llena o navegacion privada. */
export function guardarFormatoTexto(formato: FormatoTexto): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE_FORMATO_TEXTO, formato);
  } catch {
    // El formato sigue activo durante la sesion aunque no se pueda guardar.
  }
}
