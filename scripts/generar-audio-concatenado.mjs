#!/usr/bin/env node
/**
 * Genera audio concatenado (offline) uniendo silabas ya grabadas con un crossfade
 * corto y recortando el silencio inicial de cada una:
 *
 *  - Pseudopalabras -> public/audio/v1/pseudohitzak/{pseudo}.mp3
 *
 * Las palabras NUNCA se generan: se graban completas y se colocan a mano.
 * Este script solo une silabas para pseudopalabras.
 *
 * Nunca sobrescribe una grabacion existente salvo con --forzar.
 * El resultado es audio estatico: no hay TTS ni sintesis en runtime.
 *
 * Uso: npm run audio:generar [-- --forzar] [--solo=pseudohitzak]
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_AUDIO = join(RAIZ, "public", "audio", "v1");
const FONEMA = "m";
const VOCALES = new Set(["a", "e", "i", "o", "u"]);
const FORZAR = process.argv.includes("--forzar");
const SOLO = process.argv
  .find((arg) => arg.startsWith("--solo="))
  ?.split("=")[1];
const GENERAR_PSEUDOS = !SOLO || SOLO === "pseudohitzak";
if (!GENERAR_PSEUDOS) {
  console.error("--solo solo admite 'pseudohitzak'; las palabras se graban, no se generan");
  process.exit(1);
}
/** Solape entre silabas en ms. Mas solape = menos sensacion de corte. */
const CRUCE_MS = Number(
  process.argv.find((arg) => arg.startsWith("--crossfade="))?.split("=")[1] ?? 150
);

const PSEUDOPALABRAS = ["memi", "mimu", "mumo", "moma", "memu", "mume"];

const rutaSilaba = (silaba) =>
  VOCALES.has(silaba)
    ? join(DIR_AUDIO, "vocales", `${silaba}.mp3`)
    : join(DIR_AUDIO, FONEMA, `${silaba}.mp3`);

/** Recorta silencio al principio Y al final: la union solo debe aportar el crossfade. */
const RECORTAR =
  "silenceremove=start_periods=1:start_threshold=-45dB," +
  "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse";

function generar(silabas, salida) {
  const entradas = silabas.map(rutaSilaba);
  const faltan = entradas.filter((ruta) => !existsSync(ruta));
  if (faltan.length > 0) {
    console.error(`  ! Faltan audios: ${faltan.map((r) => r.replace(RAIZ, "")).join(", ")}`);
    return false;
  }
  if (existsSync(salida) && !FORZAR) {
    console.log(`  = ${salida.replace(RAIZ, "")} (ya existe, se salta)`);
    return true;
  }

  const filtros = entradas.map(
    (_, indice) => `[${indice}:a]${RECORTAR}[a${indice}]`
  );
  let ultimo = "a0";
  for (let i = 1; i < entradas.length; i += 1) {
    const destino = i === entradas.length - 1 ? "a" : `mix${i}`;
    filtros.push(
      `[${ultimo}][a${i}]acrossfade=d=${(CRUCE_MS / 1000).toFixed(3)}:c1=tri:c2=tri[${destino}]`
    );
    ultimo = destino;
  }

  mkdirSync(dirname(salida), { recursive: true });
  const argumentos = [
    "-y",
    ...entradas.flatMap((ruta) => ["-i", ruta]),
    "-filter_complex",
    filtros.join(";"),
    "-map",
    "[a]",
    "-ar",
    "44100",
    "-ac",
    "1",
    "-b:a",
    "128k",
    salida,
  ];

  const resultado = spawnSync("ffmpeg", argumentos, { encoding: "utf8" });
  if (resultado.status !== 0) {
    console.error(`  ! ffmpeg fallo: ${resultado.stderr}`);
    return false;
  }

  const medida = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", salida],
    { encoding: "utf8" }
  );
  const ms = Math.round(Number(medida.stdout) * 1000);
  console.log(`  + ${salida.replace(RAIZ, "")} -> ${ms} ms`);
  return true;
}

if (GENERAR_PSEUDOS) {
  console.log("\nPseudohitzak:");
  PSEUDOPALABRAS.forEach((pseudopalabra) =>
    generar(
      [pseudopalabra.slice(0, 2), pseudopalabra.slice(2, 4)],
      join(DIR_AUDIO, "pseudohitzak", `${pseudopalabra}.mp3`)
    )
  );
}

console.log("\nRecuerda actualizar DURACIONES_MS con las duraciones nuevas.\n");
