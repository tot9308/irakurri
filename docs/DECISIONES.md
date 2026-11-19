# Irakurri — decisiones, pendientes y fases

> Documento de referencia del proyecto. Si algo aquí contradice `.clinerules`, manda `.clinerules`.
> Última actualización: 18 de noviembre de 2026.

## 1. Estado actual

- **Modo invitado**: letra `m` completa (lección de 8 pasos + `Segida` + `Hitzak`).
- **Vocales**: pendiente. Se hará una sección de vocales **antes** de la `m` (acordado, sin fecha).
- **Modo Gela**: no implementado. El esquema SQL (`supabase/migrations/0001_initial_schema.sql`) y las políticas RLS existen, pero **Supabase no está conectado** y `/login` todavía no existe.
- **Tests**: 55 unitarios (Vitest) y 13 e2e (Playwright).

## 2. Decisiones cerradas

### Producto

| Decisión | Detalle |
|---|---|
| Idioma de la UI | Euskera batua. Castellano solo para orientación a adultos si hiciera falta. |
| Evaluación | Sin notas numéricas, sin rankings, sin comparaciones sociales. Feedback neutro (`Oso ondo!` / `Saiatu berriro`). |
| Cuentas | Solo el adulto tiene cuenta. El niño no tiene email. |
| Progreso en invitado | Anónimo en `localStorage`, clave versionada `irakurri:invitado:v1`. |
| Orden fonológico | `m, k, t, l, b, p, d, n, f, g, r, rr, j, s, x, z, ts, tx, tz`. |
| Vocales | Sección propia antes de la `m` (pendiente de diseño). |
| Alcance actual | Refinar la `m`. **No** se añaden más fonemas hasta que se pida. |

### Pedagogía de una letra

Orden de la lección (8 pasos):

1. **Grafema**: letra + sonido aislado.
2. **Silabak**: `m + a = ma` explícito, vocal a vocal.
3. **Hitza**: palabra-ancla que empieza por la sílaba (imagen + palabra escrita + audio de palabra y de sílaba).
4. **Errepikatu**: sílabas en orden no alfabético, el niño repite en voz alta.
5. **Entzun eta aukeratu**: suena una sílaba y se elige entre las 5 (`ma…mu`). 12 rondas.
6. **Pseudohitzak**: palabras sin significado con las sílabas de la letra, para decodificar sin apoyo léxico.
7. **Irakurri hitzak**: palabra escrita + foto + audio; el niño lee en voz alta.
8. **Aukeratu irudia**: palabra escrita + 3 fotos; elige la correcta.

Reglas:

- Un error **nunca** bloquea: se marca y se limpia solo.
- En `Hitzak` (constructor), la palabra objetivo **no se escribe** hasta acertar.
- El niño puede repetir audio tantas veces como quiera.
- Los pasos completados se guardan y la lección **retoma en el primer paso pendiente**.
- El menú permite **entrar a cualquier paso** para repetirlo suelto.
- Al terminar: pantalla de cierre sin notas (`Berriz hasi` / `Menua`).

### Menú de ejercicios (por niveles y colores)

- **Nivel 1 — Fonema ikasi** (azul): los **8 pasos como botones independientes**. Se puede repetir un paso suelto.
- **Nivel 2 — Praktikatu** (ámbar): `Segida` acumulativa con control de velocidad.
- **Nivel 3 — Hitzak** (verde): constructor de palabras.
- El paso `Hitza` (singular) no debe confundirse con el nivel `Hitzak` (plural).

### Técnica

| Decisión | Detalle |
|---|---|
| Stack | Next.js App Router + TypeScript + Tailwind v4 (CSS-first, `@theme` en `app/globals.css`; sin `tailwind.config`). |
| UI | Sin librerías de UI ni de animación. Iconos SVG propios (`components/ui/Iconos.tsx`). Animaciones con CSS y Web Animations API. |
| Audio | **Nunca TTS en runtime.** Audio estático, versionado e inmutable. |
| Reproducción | Un `HTMLAudioElement` por clave, precargado y reutilizado. La secuencia encadena por `onended`. |
| Velocidad | 0,5 / 0,75 / 1 / 1,25 / 1,5. Afecta **solo a la pausa**, nunca a `playbackRate`. |
| Táctil | Un toque para elegir y colocar; sin drag&drop. Objetivos ≥64 px (acciones 88 px). Sin depender de `hover`. |
| Accesibilidad | Botones nativos, `aria-live` para la sílaba actual, `prefers-reduced-motion`. |
| Persistencia | Lectura segura en SSR, saneado de JSON corrupto, tolerancia a cuota llena. |
| Nomenclatura del código | Español (archivos, tipos, comentarios). |

### Audio y assets

| Recurso | Ruta | Nota |
|---|---|---|
| Sílabas | `public/audio/v1/{fonema}/{silaba}.mp3` | p. ej. `m/ma.mp3` |
| Fonema aislado | `public/audio/v1/{fonema}/{fonema}.mp3` | `m/m.mp3` |
| Vocales | `public/audio/v1/vocales/{vocal}.mp3` | compartidas entre fonemas |
| Palabras | `public/audio/v1/{fonema}/{palabra}.mp3` | grabación completa o generada |
| Palabras generadas | misma ruta | solo si no hay grabación; el script no la sobrescribe |
| Pseudopalabras | `public/audio/v1/pseudohitzak/{pseudopalabra}.mp3` | **generadas** por script |
| Fotos | `public/img/v1/palabras/{palabra}.png` | también se aceptan webp/jpg/jpeg/svg |
| Manifest | `lib/audio-provider/manifest.ts` | duraciones reales medidas con `ffprobe` |
| Verificación | `npm run audio:check` | claves ↔ archivos, duración, silencios, formato |
| Generación | `npm run audio:generar` | concatena sílabas con `acrossfade` (offline) |

- Formato actual: MP3 mono, 24 kHz (se acepta 44,1/48 kHz). Duraciones medidas con `ffprobe`.
- Las palabras se ofrecen en la lección si existe su audio completo; en el **constructor** solo si **todas sus sílabas** tienen audio (evita fichas mudas).

### Datos y privacidad

- RLS obligatoria desde la primera migración.
- Nombres reales permitidos en Gela; sin datos sensibles más allá de lo necesario.
- El modo invitado no envía datos a ningún servidor.


## 3. Inventario de la letra `m`

- Sílabas: `ma, me, mi, mo, mu` + fonema aislado `m`.
- Palabras validadas (con foto): `mamua`, `umea`, `mimo`, `ama`, `amama`, `momia`, `meloi`, `musu`.
- Palabras-ancla por sílaba: `ma → mamua`, `me → meloi`, `mi → mimo`, `mo → momia`, `mu → musu`.
- Pseudopalabras: `mema, mimu, mumo, moma, memu, mame` (**pendiente de validar** que no sean palabras reales).

## 4. Pendientes

| # | Tipo | Pendiente | Responsable |
|---|---|---|---|
| 1 | Validación | Confirmar que las pseudopalabras no son palabras reales en euskera | Equipo |
| 2 | Decisión | ¿12 o 15 rondas en `Entzun eta aukeratu`? | Equipo |
| 3 | Validación | Revisar los textos en euskera de los 8 pasos y del cierre | Equipo |
| 4 | Decisión | ¿La primera vez que se elige `m` se entra directo a `Ikasi` o se queda el menú? | Equipo |
| 5 | Decisión | ¿`Hurrengo ariketa` de `Segida` debe llevar a `Ikasi` en vez de a `Hitzak`? | Equipo |
| 6 | Calidad | Audios a 24 kHz con 58–96 ms de silencio inicial; valorar normalizar a 44,1 kHz y recortar | Dev |
| 7 | Contenido | Audios de las sílabas `loi` y `su` para poder construir `meloi` y `musu` en `Hitzak` | Equipo |
| 8 | Producto | Sección de **vocales** antes de la `m` | Equipo |
| 9 | Deuda | `/login` no existe (el botón de la landing da 404) | Dev |
| 10 | Deuda | Conectar Supabase, auth adulto, alumnos sin email y progreso en base de datos (Gela) | Dev |
| 11 | Deuda | e2e del flujo Gela completo (requisito del proyecto) | Dev |
| 12 | Futuro | Trazo/escritura de la letra (canvas) | Equipo |

## 5. Fases

| Fase | Contenido | Estado |
|---|---|---|
| **F0** | Esqueleto, catálogo, modo invitado con la `m`, audio estático, tests base | Hecho |
| **F1 (actual)** | Refinar la `m`: lección de 8 pasos, menú por niveles, audio de calidad, vocabulario validado | En curso |
| **F1.5** | Sección de **vocales** previa a la `m` | Pendiente |
| **F2** | Escalar a `k, t, l, b, p, d, n, f, g, r, rr, j, s, x, z, ts, tx, tz` (el código ya es genérico; solo faltan audios, fotos y palabras) | Pendiente |
| **F3** | Modo **Gela**: Supabase, auth del adulto, alumnos, progreso en base de datos | Pendiente |
| **F4** | Familia/informes cualitativos (sin notas ni rankings) | Pendiente |

## 6. Cómo trabajar en este repo

```
npm run dev           # http://localhost:3000/invitado
npm test              # lógica (Vitest)
npm run test:e2e      # flujo real (Playwright, usa Chrome instalado, puerto 3100)
npm run audio:check   # valida audios contra el manifest
npm run audio:generar # regenera pseudopalabras y palabras sin grabación
npm run build
```

Regla de trabajo: cualquier decisión nueva se añade a este documento en el mismo cambio que la implementa.

