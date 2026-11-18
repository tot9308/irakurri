import * as React from "react";

interface IconoProps {
  className?: string;
}

const BASE = "h-9 w-9";

function clases(className?: string) {
  return className ? `${BASE} ${className}` : BASE;
}

/** Play (triangulo relleno). */
export function IconoPlay({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={clases(className)} fill="currentColor" aria-hidden="true">
      <path d="M8 5.2v13.6a1 1 0 0 0 1.54.84l10.4-6.8a1 1 0 0 0 0-1.68L9.54 4.36A1 1 0 0 0 8 5.2Z" />
    </svg>
  );
}

/** Pausa (dos barras rellenas). */
export function IconoPausa({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={clases(className)} fill="currentColor" aria-hidden="true">
      <rect x="6" y="4.5" width="4.2" height="15" rx="1.4" />
      <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.4" />
    </svg>
  );
}

/** Repetir (flecha circular antihoraria). */
export function IconoRepetir({ className }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clases(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.2 4.8v4.6h4.6" />
    </svg>
  );
}

/** Saltar a la siguiente (triangulo + barra). */
export function IconoAvanzar({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={clases(className)} fill="currentColor" aria-hidden="true">
      <path d="M6 5.4v13.2a1 1 0 0 0 1.53.85l8.3-5.4a1 1 0 0 0 0-1.7l-8.3-5.4A1 1 0 0 0 6 5.4Z" />
      <rect x="17.2" y="4.6" width="2.8" height="14.8" rx="1.2" />
    </svg>
  );
}

/** Parar (cuadrado). */
export function IconoParar({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={clases(className)} fill="currentColor" aria-hidden="true">
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.4" />
    </svg>
  );
}

/** Flecha de volver. */
export function IconoAtras({ className }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clases(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 5 7.5 12l7 7" />
    </svg>
  );
}

/** Altavoz con ondas (escuchar). */
export function IconoSoinua({ className }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clases(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4Z" fill="currentColor" stroke="none" />
      <path d="M15.2 8.2a5.2 5.2 0 0 1 0 7.6" />
      <path d="M17.8 5.6a8.8 8.8 0 0 1 0 12.8" />
    </svg>
  );
}

/** Marco de imagen (placeholder cuando falta la foto). */
export function IconoImagen({ className }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clases(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="m5 17 4.5-4.4 3.2 3.1 2.4-2.3 4 3.6" />
    </svg>
  );
}


/** Tick de acierto. */
export function IconoCheck({ className }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clases(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

