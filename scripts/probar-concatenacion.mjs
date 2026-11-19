#!/usr/bin/env node
/**
 * Prueba de concatenacion: genera variantes de una palabra uniendo silabas
 * recortadas por ambos extremos, para comparar de oido.
 *
 * Uso: node scripts/probar-concatenacion.mjs
 * Salida: public/audio/v1/pruebas/{palabra}-{variante}.mp3
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_AUDIO = join(RAIZ, "public", "audio", "v1");
const SALIDA = join(DIR_AUDIO, "pruebas");

const A = join(RAIZ, "public", "audio", "fuentes", "a1.mp3");
const MA = join(RAIZ, "public", "audio", "fuentes", "ma1.mp3");

const RECORTAR =
  "silenceremove=start_periods=1:start_threshold=-45dB," +
  "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse";

const VARIANTES = [
  { id: "crossfade120", cruce: 0.12, descripcion: "solape 120 ms" },
  { id: "crossfade180", cruce: 0.18, descripcion: "solape 180 ms" },
  { id: "crossfade250", cruce: 0.25, descripcion: "solape 250 ms" },
  { id: "gap30", cruce: 0, descripcion: "union con 30 ms de silencio" },
];

const PALABRAS = [
  { nombre: "ama", silabas: [A, MA] },
  { nombre: "amama", silabas: [A, MA, MA] },
];

function filtroUnion(numero, variante) {
  const recortes = Array.from({ length: numero }, (_, i) => `[${i}:a]${RECORTAR}[a${i}]`);

  if (variante.id.startsWith("crossfade")) {
    let ultimo = "a0";
    for (let i = 1; i < numero; i += 1) {
      const destino = i === numero - 1 ? "a" : `mezcla${i}`;
      recortes.push(
        `[${ultimo}][a${i}]acrossfade=d=${variante.cruce.toFixed(3)}:c1=tri:c2=tri[${destino}]`
      );
      ultimo = destino;
    }
    return recortes.join(";");
  }

  const trozos = [];
  for (let i = 0; i < numero; i += 1) {
    const esUltima = i === numero - 1;
    if (esUltima) {
      trozos.push(`[a${i}]`);
    } else {
      recortes.push(`[a${i}]apad=pad_dur=0.03[a${i}p]`);
      trozos.push(`[a${i}p]`);
    }
  }
  recortes.push(`${trozos.join("")}concat=n=${numero}:v=0:a=1[a]`);
  return recortes.join(";");
}

mkdirSync(SALIDA, { recursive: true });

for (const { nombre, silabas } of PALABRAS) {
  if (silabas.some((ruta) => !existsSync(ruta))) {
    console.error(`Faltan audios para ${nombre}`);
    continue;
  }

  for (const variante of VARIANTES) {
    const salida = join(SALIDA, `${nombre}-${variante.id}.mp3`);
    const argumentos = [
      "-y",
      ...silabas.flatMap((ruta) => ["-i", ruta]),
      "-filter_complex",
      filtroUnion(silabas.length, variante),
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
      console.error(`ffmpeg fallo (${nombre}-${variante.id}):\n${resultado.stderr}`);
      continue;
    }
    const medida = spawnSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", salida],
      { encoding: "utf8" }
    );
    console.log(
      `${nombre}-${variante.id}: ${Math.round(Number(medida.stdout) * 1000)} ms (${variante.descripcion})`
    );
  }
}

console.log(`\nArchivos en public/audio/v1/pruebas/\n`);
