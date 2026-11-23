"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as React from "react";
import { Button } from "@/components/ui/Button";
import type { Vocal } from "@/lib/vocales";
import { TrazoVocal, type CasoLetra } from "./TrazoVocal";

const COLOR_TRAZO = "#0369a1";

interface PizarraTrazoProps {
  vocal: Vocal;
  caso?: CasoLetra;
}

/**
 * Pizarra libre para repasar la letra con el dedo o el raton.
 * No corrige ni puntua: solo permite borrar y empezar de nuevo.
 */
export function PizarraTrazo({ vocal, caso = "minuscula" }: PizarraTrazoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dibujando = useRef(false);
  const [hayTrazo, setHayTrazo] = useState(false);

  const contexto = () => canvasRef.current?.getContext("2d") ?? null;

  const configurar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.width * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = Math.max(8, rect.width * 0.04);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = COLOR_TRAZO;
    setHayTrazo(false);
  }, []);

  useEffect(() => {
    configurar();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const observador = new ResizeObserver(configurar);
    observador.observe(canvas);
    return () => observador.disconnect();
  }, [configurar]);

  const punto = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - rect.left, y: evento.clientY - rect.top };
  };

  const empezar = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    evento.preventDefault();
    evento.currentTarget.setPointerCapture(evento.pointerId);
    const ctx = contexto();
    if (!ctx) return;
    const { x, y } = punto(evento);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y);
    ctx.stroke();
    dibujando.current = true;
    setHayTrazo(true);
  };

  const mover = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return;
    const ctx = contexto();
    if (!ctx) return;
    const { x, y } = punto(evento);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const terminar = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    dibujando.current = false;
    try {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    } catch {
      /* el puntero ya se ha liberado */
    }
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    const ctx = contexto();
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHayTrazo(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-square w-[min(58vw,320px)] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-inner">
        <TrazoVocal
          vocal={vocal}
          caso={caso}
          modo="guia"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <canvas
          ref={canvasRef}
          aria-label={`${caso === "mayuscula" ? vocal.toUpperCase() : vocal} letra trazatzea`}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={empezar}
          onPointerMove={mover}
          onPointerUp={terminar}
          onPointerCancel={terminar}
        />
      </div>
      <Button variant="secondary" size="sm" onClick={limpiar} disabled={!hayTrazo}>
        Garbitu
      </Button>
    </div>
  );
}
