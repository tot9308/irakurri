"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { claveSilaba } from "@/lib/audio-provider/manifest";
import { ProveedorEstatico } from "@/lib/audio-provider/proveedorEstatico";
import {
  bancoDeSilabas,
  claveAudioPalabra,
  palabrasConAudio,
  type Palabra,
} from "@/lib/palabras";
import { leerProgreso, marcarPalabraCompletada } from "@/lib/progreso";
import {
  colocar,
  estadoInicial,
  limpiarError,
  quitar,
  vaciar,
  type EstadoConstructor,
} from "./constructor";

const PAUSA_ENTRE_SILABAS_MS = 180;
const LIMPIEZA_ERROR_MS = 800;
const SILABAS_EXTRA = ["ma", "me", "mi", "mo", "mu", "a", "e", "i", "o", "u"];

function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/**
 * Orquesta el constructor de palabras: estado, audio del objetivo y correccion.
 * El objetivo nunca se muestra escrito; se escucha (grabacion de la palabra o
 * secuencia de sus silabas).
 */
export function useConstructor(fonema: string) {
  const disponibles = useMemo(() => palabrasConAudio(fonema), [fonema]);
  const [indice, setIndice] = useState(0);
  const [estado, setEstado] = useState<EstadoConstructor>(estadoInicial);
  const estadoRef = useRef(estado);
  const tokenRef = useRef(0);

  const proveedorRef = useRef<ProveedorEstatico | null>(null);
  if (proveedorRef.current === null) {
    proveedorRef.current = new ProveedorEstatico();
  }
  const proveedor = proveedorRef.current;

  const palabra: Palabra | undefined = disponibles[indice];
  // El banco solo muestra silabas que pueden sonar (nada de fichas mudas).
  const banco = useMemo(() => {
    const extrasConAudio = SILABAS_EXTRA.filter((silaba) =>
      proveedor.disponible(claveSilaba(fonema, silaba))
    );
    return bancoDeSilabas(palabra?.silabas ?? [], extrasConAudio, 2);
  }, [palabra, fonema, proveedor]);

  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  // Precarga de todo lo que puede sonar en esta pantalla.
  useEffect(() => {
    const claves = new Set<string>();
    disponibles.forEach((p) => {
      claves.add(claveAudioPalabra(p));
      p.silabas.forEach((s) => claves.add(claveSilaba(p.fonema, s)));
    });
    SILABAS_EXTRA.forEach((s) => claves.add(claveSilaba(fonema, s)));
    proveedor.precargar([...claves]);
  }, [disponibles, fonema, proveedor]);

  useEffect(
    () => () => {
      tokenRef.current += 1;
      proveedor.stop();
    },
    [proveedor]
  );

  // Arranca en la primera palabra pendiente del progreso local.
  useEffect(() => {
    const completadas = new Set(leerProgreso()[fonema]?.palabrasCompletadas ?? []);
    const pendiente = disponibles.findIndex((p) => !completadas.has(p.id));
    setIndice(pendiente >= 0 ? pendiente : 0);
    estadoRef.current = estadoInicial();
    setEstado(estadoRef.current);
  }, [fonema, disponibles]);

  // Un error nunca bloquea: se limpia solo tras un instante.
  useEffect(() => {
    if (estado.fase !== "error") return;
    const temporizador = setTimeout(() => {
      estadoRef.current = limpiarError(estadoRef.current);
      setEstado(estadoRef.current);
    }, LIMPIEZA_ERROR_MS);
    return () => clearTimeout(temporizador);
  }, [estado.fase]);

  const reproducirPalabra = useCallback(async () => {
    if (!palabra) return;
    const token = ++tokenRef.current;
    const clavePalabra = claveAudioPalabra(palabra);
    if (proveedor.disponible(clavePalabra)) {
      await proveedor.play(clavePalabra);
      return;
    }
    // Sin grabacion de la palabra: se oye silaba a silaba.
    for (const silaba of palabra.silabas) {
      if (token !== tokenRef.current) return;
      await proveedor.play(claveSilaba(palabra.fonema, silaba));
      if (token !== tokenRef.current) return;
      await esperar(PAUSA_ENTRE_SILABAS_MS);
    }
  }, [palabra, proveedor]);

  const colocarSilaba = useCallback(
    (silaba: string) => {
      if (!palabra) return;
      const siguiente = colocar(estadoRef.current, silaba, palabra.silabas);
      if (siguiente === estadoRef.current) return;
      estadoRef.current = siguiente;
      setEstado(siguiente);

      void proveedor.play(claveSilaba(fonema, silaba));

      if (siguiente.fase === "correcto") {
        marcarPalabraCompletada(fonema, palabra.id);
        setTimeout(() => {
          void reproducirPalabra();
        }, 450);
      }
    },
    [fonema, palabra, proveedor, reproducirPalabra]
  );

  const quitarSilaba = useCallback((posicion: number) => {
    const siguiente = quitar(estadoRef.current, posicion);
    if (siguiente === estadoRef.current) return;
    estadoRef.current = siguiente;
    setEstado(siguiente);
  }, []);

  const vaciarTodo = useCallback(() => {
    const siguiente = vaciar(estadoRef.current);
    estadoRef.current = siguiente;
    setEstado(siguiente);
  }, []);

  const siguientePalabra = useCallback(() => {
    if (disponibles.length === 0) return;
    setIndice((actual) => (actual + 1) % disponibles.length);
    estadoRef.current = estadoInicial();
    setEstado(estadoRef.current);
  }, [disponibles.length]);

  return {
    palabra,
    total: disponibles.length,
    indice,
    estado,
    banco,
    sinPalabras: disponibles.length === 0,
    colocarSilaba,
    quitarSilaba,
    vaciarTodo,
    siguientePalabra,
    reproducirPalabra,
  };
}
