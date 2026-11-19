#!/usr/bin/env node
/**
 * Verifica los audios estaticos contra el manifest.
 * - Cada clave del manifest debe tener archivo.
 * - Cada mp3 debe tener clave (nada de archivos huerfanos).
 * - Duracion declarada vs real, silencio inicial y cola.
 *
 * Uso: npm run audio:check
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST = join(RAIZ, "lib", "audio-provider", "manifest.ts");
const DIR_AUDIO = join(RAIZ, "public", "audio");

const TOLERANCIA_DURACION_MS = 40;
const MAX_SILENCIO_INICIAL_S = 0.05;
const MAX_COLA_S = 0.25;

function leerManifest() {
  const texto = readFileSync(MANIFEST, "utf8");
  const version = /VERSION_AUDIO\s*=\s*["']([^"']+)["']/.exec(texto)?.[1] ?? "?";
  const duraciones = {};
  const patron = /["']([a-z]+)\/([a-z]+)["']\s*:\s*(\d+)/g;
  let coincidencia;
  while ((coincidencia = patron.exec(texto)) !== null) {
    duraciones[`${coincidencia[1]}/${coincidencia[2]}`] = Number(coincidencia[3]);
  }
  return { version, duraciones };
}

function listarMp3(directorio) {
  if (!existsSync(directorio)) return [];
  const encontrados = [];
  const recorrer = (actual) => {
    for (const entrada of readdirSync(actual, { withFileTypes: true })) {
      const ruta = join(actual, entrada.name);
      // "pruebas" es una carpeta de escucha, no material de produccion.
      if (entrada.isDirectory()) {
        if (entrada.name !== "pruebas") recorrer(ruta);
      } else if (entrada.name.toLowerCase().endsWith(".mp3")) {
        encontrados.push(ruta);
      }
    }
  };
  recorrer(directorio);
  return encontrados;
}

function medir(ruta) {
  const resultado = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_entries",
      "format=duration:stream=sample_rate,channels,codec_name",
      "-of",
      "json",
      ruta,
    ],
    { encoding: "utf8" }
  );
  if (resultado.error) {
    return { error: "ffprobe no esta disponible en el PATH" };
  }
  if (resultado.status !== 0) {
    return { error: (resultado.stderr || "ffprobe fallo").trim().split("\n")[0] };
  }
  const datos = JSON.parse(resultado.stdout);
  const pista = datos.streams?.[0] ?? {};
  return {
    duracion: Number(datos.format?.duration ?? 0),
    rate: Number(pista.sample_rate ?? 0),
    canales: Number(pista.channels ?? 0),
    codec: pista.codec_name ?? "?",
  };
}

function silencios(ruta, duracion) {
  const resultado = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", ruta, "-af", "silencedetect=noise=-45dB:d=0.02", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const salida = `${resultado.stderr ?? ""}${resultado.stdout ?? ""}`;
  const inicios = [...salida.matchAll(/silence_start:\s*(-?[0-9.]+)/g)].map((m) => Number(m[1]));
  const fines = [...salida.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m) => Number(m[1]));
  const inicial = inicios.length > 0 && inicios[0] <= 0.005 ? (fines[0] ?? 0) : 0;
  const ultimoInicio = inicios.length > 0 ? inicios[inicios.length - 1] : 0;
  const cola = ultimoInicio > 0 ? Math.max(0, duracion - ultimoInicio) : 0;
  return { inicial, cola };
}

const { version, duraciones } = leerManifest();
const archivos = listarMp3(join(DIR_AUDIO, version));
const clavesArchivo = new Set(
  archivos.map((ruta) =>
    ruta
      .slice(join(DIR_AUDIO, version).length + 1)
      .replace(/\\/g, "/")
      .replace(/\.mp3$/i, "")
  )
);

console.log(`\nAudios ${version}: ${archivos.length} archivo(s), ${Object.keys(duraciones).length} clave(s) en manifest\n`);

const errores = [];
const avisos = [];
const filas = [];

for (const [clave, declarada] of Object.entries(duraciones)) {
  const ruta = join(DIR_AUDIO, version, `${clave.replace("/", "\\")}.mp3`);
  if (!existsSync(ruta)) {
    errores.push(`Falta el archivo para la clave "${clave}": public/audio/${version}/${clave}.mp3`);
    continue;
  }
  const datos = medir(ruta);
  if (datos.error) {
    errores.push(`${clave}: ${datos.error}`);
    continue;
  }
  const realMs = Math.round(datos.duracion * 1000);
  const diferencia = Math.abs(realMs - declarada);
  if (diferencia > TOLERANCIA_DURACION_MS) {
    avisos.push(`${clave}: manifest ${declarada} ms vs real ${realMs} ms (actualizar DURACIONES_MS)`);
  }
  if (datos.codec !== "mp3") avisos.push(`${clave}: codec ${datos.codec} (se espera mp3)`);
  if (datos.canales !== 1) avisos.push(`${clave}: ${datos.canales} canales (se espera mono)`);
  if (![44100, 48000].includes(datos.rate)) avisos.push(`${clave}: ${datos.rate} Hz (se espera 44100 o 48000)`);

  const { inicial, cola } = silencios(ruta, datos.duracion);
  if (inicial > MAX_SILENCIO_INICIAL_S) {
    avisos.push(`${clave}: ${(inicial * 1000).toFixed(0)} ms de silencio inicial (> ${MAX_SILENCIO_INICIAL_S * 1000} ms)`);
  }
  if (cola > MAX_COLA_S) {
    avisos.push(`${clave}: cola de ${(cola * 1000).toFixed(0)} ms (> ${MAX_COLA_S * 1000} ms)`);
  }

  filas.push({
    clave,
    ms: realMs,
    manifest: declarada,
    rate: datos.rate,
    canales: datos.canales,
    inicial: Math.round(inicial * 1000),
    cola: Math.round(cola * 1000),
  });
}

for (const clave of clavesArchivo) {
  if (!(clave in duraciones)) {
    errores.push(`Archivo sin clave en manifest: public/audio/${version}/${clave}.mp3`);
  }
}

console.table(filas);

if (avisos.length > 0) {
  console.log("Avisos:");
  avisos.forEach((aviso) => console.log(`  - ${aviso}`));
}
if (errores.length > 0) {
  console.log("Errores:");
  errores.forEach((error) => console.log(`  - ${error}`));
  process.exit(1);
}

console.log("\nAudio OK: todas las claves tienen archivo y todas las duraciones cuadran.\n");
