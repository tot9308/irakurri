#!/usr/bin/env node
/**
 * Normaliza las grabaciones de palabras: recorta silencio inicial y final,
 * y las deja en mono 44,1 kHz. Guarda una copia del original en
 * public/audio/v1/{fonema}/originales/ (excluida de la validacion).
 *
 * Uso: node scripts/normalizar-palabras.mjs
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_FONEMA = join(RAIZ, "public", "audio", "v1", "m");
const ORIGINALES = join(DIR_FONEMA, "originales");

const PALABRAS = ["ama", "amama", "mamua", "mimo", "momia", "umea", "meloi", "musu"];

const RECORTAR =
  "silenceremove=start_periods=1:start_threshold=-45dB," +
  "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse";

mkdirSync(ORIGINALES, { recursive: true });

for (const palabra of PALABRAS) {
  const ruta = join(DIR_FONEMA, `${palabra}.mp3`);
  if (!existsSync(ruta)) {
    console.log(`- ${palabra}: no existe, se salta`);
    continue;
  }

  const respaldo = join(ORIGINALES, `${palabra}.mp3`);
  if (!existsSync(respaldo)) copyFileSync(ruta, respaldo);

  const temporal = join(DIR_FONEMA, `${palabra}.tmp.mp3`);
  const resultado = spawnSync(
    "ffmpeg",
    ["-y", "-i", ruta, "-af", RECORTAR, "-ar", "44100", "-ac", "1", "-b:a", "128k", temporal],
    { encoding: "utf8" }
  );
  if (resultado.status !== 0) {
    console.error(`! ${palabra}: ffmpeg fallo\n${resultado.stderr}`);
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
    `${palabra}: ${Math.round(Number(medida.stdout) * 1000)} ms (original en originales/)`
  );
}

console.log("\nRecuerda actualizar DURACIONES_MS con las duraciones nuevas.\n");
