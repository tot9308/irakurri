/**
 * Resultado cualitativo de un ejercicio. Sin notas numericas ni rankings:
 * solo estrellas (3 = todo bien, 2 = mayoria, 1 = menos de la mitad).
 */
export type Estrellas = 1 | 2 | 3;

export function estrellas(aciertos: number, total: number): Estrellas {
  if (total <= 0) return 1;
  const proporcion = aciertos / total;
  if (proporcion >= 1) return 3;
  if (proporcion >= 0.5) return 2;
  return 1;
}

export function mensajeResultado(valor: Estrellas): string {
  if (valor === 3) return "Bikain!";
  if (valor === 2) return "Oso ondo!";
  return "Ondo! Segi praktikatzen.";
}
