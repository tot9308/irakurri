"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { itemsByPhoneme } from "@/lib/catalog";
import { claveAudio, FONEMAS_CON_AUDIO_AISLADO } from "@/lib/audio-provider/manifest";
import { ProveedorEstatico } from "@/lib/audio-provider/proveedorEstatico";
import { marcarSecuenciaCompletada } from "@/lib/progreso";
import {
  construirSecuencia,
  intervaloRespaldo,
  pausaEntreSilabas,
  siguientePaso,
  mostradas as contarMostradas,
  type Fase,
  type Velocidad,
} from "./secuencia";

/**
 * Orquesta la secuencia acumulativa: estado, audio y temporizacion.
 * La temporizacion se dispara al terminar el audio (onended), no con un timeout fijo,
 * para que la silaba que se ve y la que se oye no se desincronicen.
 */
export function useSecuencia(fonema: string) {
  const silabas = useMemo(() => {
    const items = itemsByPhoneme(fonema).filter((i) => i.type === "syllable");
    return construirSecuencia(
      fonema,
      items.map((i) => i.grapheme)
    );
  }, [fonema]);

  const [fase, setFase] = useState<Fase>("inactivo");
  const [indice, setIndice] = useState(0);
  const [intento, setIntento] = useState(0);
  const [velocidad, setVelocidad] = useState<Velocidad>(1);
  const [pulso, setPulso] = useState<{ posicion: number; veces: number }>({
    posicion: -1,
    veces: 0,
  });

  const proveedorRef = useRef<ProveedorEstatico | null>(null);
  if (proveedorRef.current === null) {
    proveedorRef.current = new ProveedorEstatico();
  }
  const proveedor = proveedorRef.current;

  // La velocidad se lee por ref: cambiarla no reinicia la silaba en curso,
  // se aplica al siguiente intervalo.
  const velocidadRef = useRef(velocidad);
  useEffect(() => {
    velocidadRef.current = velocidad;
  }, [velocidad]);

  useEffect(() => {
    proveedor.precargar(silabas.map((s) => claveAudio(fonema, s)));
  }, [fonema, silabas, proveedor]);

  useEffect(() => {
    if (fase !== "presentando") return;
    const silaba = silabas[indice];
    if (!silaba) return;

    const clave = claveAudio(fonema, silaba);
    let cancelado = false;
    let temporizador: ReturnType<typeof setTimeout> | null = null;

    const programarAvance = () => {
      const paso = siguientePaso(indice, silabas.length);
      if (paso.completado) setFase("completado");
      else setIndice(paso.indice);
    };

    const ejecutar = async () => {
      // Un frame para que la ficha este pintada antes de que suene el audio.
      await new Promise<void>((resolver) => {
        if (typeof requestAnimationFrame === "undefined") resolver();
        else requestAnimationFrame(() => resolver());
      });
      if (cancelado) return;

      if (proveedor.disponible(clave)) {
        await proveedor.play(clave);
        if (cancelado) return;
        temporizador = setTimeout(
          programarAvance,
          pausaEntreSilabas(velocidadRef.current)
        );
      } else {
        temporizador = setTimeout(
          programarAvance,
          intervaloRespaldo(velocidadRef.current)
        );
      }
    };

    void ejecutar();

    return () => {
      cancelado = true;
      if (temporizador) clearTimeout(temporizador);
      proveedor.stop();
    };
  }, [fase, indice, intento, fonema, silabas, proveedor]);

  // Al desmontar (volver al selector de fonema) nada queda sonando.
  useEffect(() => () => proveedor.stop(), [proveedor]);

  // Progreso anonimo: se marca una sola vez al completar la secuencia.
  useEffect(() => {
    if (fase === "completado") {
      marcarSecuenciaCompletada(fonema);
    }
  }, [fase, fonema]);

  const tieneFonemaAislado = FONEMAS_CON_AUDIO_AISLADO.has(fonema);

  const reproducirFonema = useCallback(() => {
    const clave = claveAudio(fonema, fonema);
    if (!proveedor.disponible(clave)) return;
    void proveedor.play(clave);
  }, [fonema, proveedor]);

  // Al entrar se presenta el fonema aislado (una vez).
  useEffect(() => {
    if (!tieneFonemaAislado) return;
    const temporizador = setTimeout(() => {
      const clave = claveAudio(fonema, fonema);
      if (proveedor.disponible(clave)) void proveedor.play(clave);
    }, 450);
    return () => clearTimeout(temporizador);
  }, [fonema, proveedor, tieneFonemaAislado]);

  const iniciar = useCallback(() => {
    if (silabas.length === 0) return;
    setIndice(0);
    setFase("presentando");
  }, [silabas.length]);

  const pausar = useCallback(() => {
    setFase((actual) => (actual === "presentando" ? "pausado" : actual));
  }, []);

  const reanudar = useCallback(() => {
    // Reanuda re-pronunciando la silaba actual desde el principio.
    setFase((actual) => (actual === "pausado" ? "presentando" : actual));
  }, []);

  const repetir = useCallback(() => {
    if (fase === "inactivo" || silabas.length === 0) {
      setIndice(0);
      setFase("presentando");
      return;
    }
    // Repite la silaba actual (en "completado", la ultima) sin alterar el orden.
    setPulso((p) => ({ posicion: indice, veces: p.veces + 1 }));
    setIntento((n) => n + 1);
    setFase("presentando");
  }, [fase, indice, silabas.length]);

  const saltar = useCallback(() => {
    if (fase === "inactivo" || fase === "completado") return;
    const paso = siguientePaso(indice, silabas.length);
    if (paso.completado) {
      setFase("completado");
      return;
    }
    setIndice(paso.indice);
    setFase("presentando");
  }, [fase, indice, silabas.length]);

  const detener = useCallback(() => {
    proveedor.stop();
    setFase("inactivo");
    setIndice(0);
    setIntento(0);
  }, [proveedor]);

  /** Escucha suelta de una silaba ya visible (no altera la secuencia). */
  const reproducirSilaba = useCallback(
    (posicion: number) => {
      if (fase === "presentando") return;
      const silaba = silabas[posicion];
      if (!silaba) return;
      setPulso((p) => ({ posicion, veces: p.veces + 1 }));
      void proveedor.play(claveAudio(fonema, silaba));
    },
    [fase, fonema, silabas, proveedor]
  );

  const cambiarVelocidad = useCallback((v: Velocidad) => setVelocidad(v), []);

  return {
    silabas,
    fase,
    indice,
    mostradas: contarMostradas(fase, indice, silabas.length),
    silabaActual:
      fase === "presentando" || fase === "pausado" ? (silabas[indice] ?? "") : "",
    velocidad,
    cambiarVelocidad,
    pulso,
    tieneFonemaAislado,
    reproducirFonema,
    iniciar,
    pausar,
    reanudar,
    repetir,
    saltar,
    detener,
    reproducirSilaba,
  };
}
