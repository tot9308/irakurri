"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProveedorEstatico } from "@/lib/audio-provider/proveedorEstatico";
import type { Fase, Velocidad } from "@/lib/fonema/secuencia";
import { pausaPractica } from "./reproductor";

interface Opciones<T> {
  elementos: readonly T[];
  reproducir: (elemento: T) => Promise<void> | void;
  proveedor: ProveedorEstatico;
  pausaBaseMs?: number;
}

/**
 * Reproductor de una secuencia de practica: play/pausa, stop, velocidad y
 * avance automatico al terminar cada audio. La velocidad solo cambia la pausa
 * entre elementos, igual que en Segida.
 */
export function useReproductorPractica<T>({
  elementos,
  reproducir,
  proveedor,
  pausaBaseMs = 900,
}: Opciones<T>) {
  const [fase, setFase] = useState<Fase>("inactivo");
  const [indice, setIndice] = useState(0);
  const [intento, setIntento] = useState(0);
  const [velocidad, setVelocidad] = useState<Velocidad>(1);

  const velocidadRef = useRef(velocidad);
  const elementosRef = useRef(elementos);
  const reproducirRef = useRef(reproducir);

  useEffect(() => {
    velocidadRef.current = velocidad;
  }, [velocidad]);

  useEffect(() => {
    elementosRef.current = elementos;
  }, [elementos]);

  useEffect(() => {
    reproducirRef.current = reproducir;
  }, [reproducir]);

  useEffect(() => {
    if (fase !== "presentando") return;
    const elemento = elementosRef.current[indice];
    if (elemento === undefined) return;

    let cancelado = false;
    let temporizador: ReturnType<typeof setTimeout> | null = null;

    const programarAvance = () => {
      const siguiente = indice + 1;
      if (siguiente >= elementosRef.current.length) setFase("completado");
      else setIndice(siguiente);
    };

    const ejecutar = async () => {
      // Un frame para que el elemento este pintado antes de que suene el audio.
      await new Promise<void>((resolver) => {
        if (typeof requestAnimationFrame === "undefined") resolver();
        else requestAnimationFrame(() => resolver());
      });
      if (cancelado) return;

      try {
        await reproducirRef.current(elemento);
      } catch {
        /* si el audio falla, la secuencia sigue con el siguiente */
      }
      if (cancelado) return;

      temporizador = setTimeout(
        programarAvance,
        pausaPractica(velocidadRef.current, pausaBaseMs)
      );
    };

    void ejecutar();

    return () => {
      cancelado = true;
      if (temporizador) clearTimeout(temporizador);
      proveedor.stop();
    };
  }, [fase, indice, intento, pausaBaseMs, proveedor]);

  useEffect(() => () => proveedor.stop(), [proveedor]);

  const iniciar = useCallback(() => {
    if (elementosRef.current.length === 0) return;
    setIndice(0);
    setIntento(0);
    setFase("presentando");
  }, []);

  const pausar = useCallback(() => {
    setFase((actual) => (actual === "presentando" ? "pausado" : actual));
  }, []);

  const reanudar = useCallback(() => {
    setFase((actual) => (actual === "pausado" ? "presentando" : actual));
  }, []);

  const repetir = useCallback(() => {
    if (fase === "inactivo") {
      setIndice(0);
      setIntento(0);
      setFase("presentando");
      return;
    }
    setIntento((n) => n + 1);
    setFase("presentando");
  }, [fase]);

  const saltar = useCallback(() => {
    if (fase === "inactivo" || fase === "completado") return;
    const siguiente = indice + 1;
    if (siguiente >= elementosRef.current.length) setFase("completado");
    else setIndice(siguiente);
  }, [fase, indice]);

  const detener = useCallback(() => {
    proveedor.stop();
    setIndice(0);
    setIntento(0);
    setFase("inactivo");
  }, [proveedor]);

  const cambiarVelocidad = useCallback((v: Velocidad) => setVelocidad(v), []);

  return {
    fase,
    indice,
    velocidad,
    cambiarVelocidad,
    iniciar,
    pausar,
    reanudar,
    repetir,
    saltar,
    detener,
  };
}
