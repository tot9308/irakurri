#!/usr/bin/env node
/**
 * Normaliza TODO el audio de produccion: recorta silencio inicial y final,
 * y deja mono 44,1 kHz. Guarda copia del original en {carpeta}/originales/.
 *
 * Uso: node scripts/normalizar-audio.mjs
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_AUDIO = join(RAIZ, "public", "audio", "v1");

const GRUPOS = [
  {
    carpeta: "m",
    nombres: [
      "m",
      "ma",
      "me",
      "mi",
      "mo",
      "mu",
      "ama",
      "amama",
      "mamua",
      "mimo",
      "momia",
      "umea",
      "meloi",
      "musu",
    ],
  },
  { carpeta: "vocales", nombres: ["a", "e", "i", "o", "u"] },
  {
    carpeta: "pseudohitzak",
    nombres: ["memi", "mimu", "mumo", "moma", "memu", "mume"],
  },
];

const RECORTAR =
  "silenceremove=start_periods=1:start_threshold=-45dB," +
  "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse";

for (const { carpeta, nombres } of GRUPOS) {
  const directorio = join(DIR_AUDIO, carpeta);
  const respaldos = join(directorio, "originales");
  mkdirSync(respaldos, { recursive: true });

  for (const nombre of nombres) {
    const ruta = join(directorio, `${nombre}.mp3`);
    if (!existsSync(ruta)) {
      console.log(`- ${carpeta}/${nombre}: no existe, se salta`);
      continue;
    }

    const respaldo = join(respaldos, `${nombre}.mp3`);
    if (!existsSync(respaldo)) copyFileSync(ruta, respaldo);

    const temporal = join(directorio, `${nombre}.tmp.mp3`);
    const resultado = spawnSync(
      "ffmpeg",
      ["-y", "-i", ruta, "-af", RECORTAR, "-ar", "44100", "-ac", "1", "-b:a", "128k", temporal],
      { encoding: "utf8" }
    );
    if (resultado.status !== 0) {
      console.error(`! ${carpeta}/${nombre}: ffmpeg fallo\n${resultado.stderr}`);
      process.exitCode = 1;
      continue;
    }

    const medida = spawnSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", temporal],
      { encoding: "utf8" }
    );
    copyFileSync(temporal, ruta);
    rmSync(temporal, { force: true });

    console.log(
      `${carpeta}/${nombre}: ${Math.round(Number(medida.stdout) * 1000)} ms (original en originales/)`
    );
  }
}

console.log("\nRecuerda actualizar DURACIONES_MS con las duraciones nuevas.\n");
