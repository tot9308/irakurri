#!/usr/bin/env node
/**
 * Analiza los audios de public/audio/v1: duracion, frecuencia, canales,
 * silencio inicial y silencio final. Sirve para decidir si un audio esta
 * listo para concatenarse con otros.
 *
 * Uso: node scripts/analizar-audio.mjs [ruta...]
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_AUDIO = join(RAIZ, "public", "audio", "v1");

function listarMp3(directorio) {
  const encontrados = [];
  const recorrer = (actual) => {
    for (const entrada of readdirSync(actual, { withFileTypes: true })) {
      const ruta = join(actual, entrada.name);
      if (entrada.isDirectory()) recorrer(ruta);
      else if (entrada.name.toLowerCase().endsWith(".mp3")) encontrados.push(ruta);
    }
  };
  recorrer(directorio);
  return encontrados;
}

function medir(ruta) {
  const info = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_entries",
      "format=duration:stream=sample_rate,channels",
      "-of",
      "json",
      ruta,
    ],
    { encoding: "utf8" }
  );
  const datos = JSON.parse(info.stdout);
  const duracion = Number(datos.format?.duration ?? 0);
  const rate = Number(datos.streams?.[0]?.sample_rate ?? 0);
  const canales = Number(datos.streams?.[0]?.channels ?? 0);

  const analisis = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", ruta, "-af", "silencedetect=noise=-45dB:d=0.02", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const salida = `${analisis.stderr ?? ""}${analisis.stdout ?? ""}`;
  const inicios = [...salida.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => Number(m[1]));
  const fines = [...salida.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => Number(m[1]));

  const inicial = inicios.length > 0 && inicios[0] <= 0.005 ? (fines[0] ?? 0) : 0;
  const ultimoInicio = inicios.length > 0 ? inicios[inicios.length - 1] : 0;
  const final = ultimoInicio > 0 ? Math.max(0, duracion - ultimoInicio) : 0;

  return { duracion, rate, canales, inicial, final };
}

const objetivos =
  process.argv.length > 2
    ? process.argv.slice(2).map((ruta) => (existsSync(ruta) ? ruta : join(DIR_AUDIO, ruta)))
    : listarMp3(DIR_AUDIO);

const filas = objetivos.map((ruta) => {
  const { duracion, rate, canales, inicial, final } = medir(ruta);
  return {
    archivo: relative(RAIZ, ruta).replace(/\\/g, "/"),
    ms: Math.round(duracion * 1000),
    hz: rate,
    canales,
    "silencio inicio": Math.round(inicial * 1000),
    "silencio fin": Math.round(final * 1000),
    "audio util": Math.round((duracion - inicial - final) * 1000),
  };
});

console.table(filas);
console.log("\nObjetivo recomendado: silencio inicial <= 30 ms, silencio final <= 50 ms.\n");
