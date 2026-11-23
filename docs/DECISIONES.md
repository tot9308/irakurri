# Irakurri — decisiones, pendientes y fases

> Documento de referencia del proyecto. Si algo aquí contradice `.clinerules`, manda `.clinerules`.
> Última actualización: 19 de noviembre de 2026.

## 1. Estado actual

- **Modo invitado**: letra `m` completa (lección de 9 pasos + `Segida` + `Hitzak`).
- **Vocales**: audio de `a, e, i, o, u` listo; sección `Bokalek` en curso. Pendientes las grabaciones completas de las 20 palabras (ver `docs/AUDIO-VOCALES.md`); la cuarta de `i` es `ilargia`.
- **Modo Gela**: no implementado. El esquema SQL (`supabase/migrations/0001_initial_schema.sql`) y las políticas RLS existen, pero **Supabase no está conectado** y `/login` todavía no existe.
- **Tests**: 75 unitarios (Vitest) y 21 e2e (Playwright).

## 2. Decisiones cerradas

### Producto

| Decisión | Detalle |
|---|---|
| Idioma de la UI | Euskera batua. Castellano solo para orientación a adultos si hiciera falta. |
| Evaluación | Sin notas numéricas, sin rankings, sin comparaciones sociales. Feedback neutro (`Oso ondo!` / `Saiatu berriro`). |
| Cuentas | Solo el adulto tiene cuenta. El niño no tiene email. |
| Progreso en invitado | Anónimo en `localStorage`, clave versionada `irakurri:invitado:v1`. |
| Orden fonológico | `m, k, t, l, b, p, d, n, f, g, r, rr, j, s, x, z, ts, tx, tz`. |
| Vocales | Sección propia antes de la `m`; palabras grabadas completas, nunca concatenadas (ver `docs/AUDIO-VOCALES.md`). |
| Alcance actual | Refinar la `m`. **No** se añaden más fonemas hasta que se pida. |

### Pedagogía de una letra

Orden de la lección (9 pasos), con `Segida` como práctica tras las sílabas:

1. **Grafema**: letra + sonido aislado.
2. **Silabak**: `m + a = ma` explícito, vocal a vocal.
3. **Errepikatu**: primero las 5 sílabas en orden (`ma…mu`) y después las mismas desordenadas; el niño repite en voz alta.
4. **Hitza**: palabra-ancla que empieza por la sílaba (imagen + palabra escrita + audio de palabra; la sílaba se puede escuchar con un toque).
5. **Entzun eta aukeratu**: suena una sílaba y se elige entre las 5 (`ma…mu`). 12 rondas.
6. **Entzun pseudohitzak**: una pseudopalabra cada vez; se escucha, se lee y se repite; avanza sola.
7. **Aukeratu pseudohitza**: suena una pseudopalabra y se elige cómo se escribe entre 4 opciones (6 rondas).
8. **Irakurri hitzak**: palabra escrita + foto + audio; el niño lee en voz alta.
9. **Aukeratu irudia**: palabra escrita + 3 fotos; elige la correcta.

`Segida` (secuencia acumulativa) se practica **después del paso 2**, cuando ya se conocen las sílabas.

Reglas:

- Un error **nunca** bloquea: se marca y se limpia solo.
- En `Hitzak` (constructor), la palabra objetivo **no se escribe** hasta acertar.
- El niño puede repetir audio tantas veces como quiera.
- Los pasos completados se guardan y la lección **retoma en el primer paso pendiente**.
- El menú permite **entrar a cualquier paso** para repetirlo suelto.
- **Resultado con estrellas** en los pasos con corrección (5 y 8): 3 estrellas si todo bien, 2 si se acierta la mitad o más, 1 si menos de la mitad. Nunca se muestran notas numéricas ni rankings.
- La pantalla de resultado ofrece `Hurrengo ariketa` y `Menua`; en el último paso, `Berriz hasi` y `Menua`.
- Al terminar `Segida`, `Hurrengo ariketa` continúa en el paso 3 (`Errepikatu`).
- En el constructor `Hitzak`, la palabra objetivo **suena sola al entrar y al cambiar de palabra** (1,5 s de margen), siempre con la **grabación real**; si el niño ya ha tocado una sílaba, no se pisa su audio.
- Los pasos **Errepikatu**, **Hitza** y **Entzun pseudohitzak** usan el reproductor de `Segida`: play/pausa, stop, repetir, saltar y velocidad (la velocidad solo cambia la pausa entre audios). El avance es **automático**; `Hurrengo ariketa` se habilita al completar la secuencia.
- En `Errepikatu` no hay cajas azules: la sílaba activa **crece** y se colorea; las demás quedan neutras. La fase 2 usa una mezcla determinista de las mismas 5 sílabas.
- En `Hitza` y `Entzun pseudohitzak` solo se muestra el elemento que suena; al terminar, aparece el siguiente.
- Al terminar: pantalla de cierre sin notas (`Berriz hasi` / `Menua`).

### Menú de ejercicios (por etapas)

Estructura elegida (**opción C, por dificultad**), con todos los botones visibles y color por etapa:

| Etapa | Color | Botones |
|---|---|---|
| **1 · Hasi** | azul | Grafema · Silabak · **Segida** · Errepikatu · Hitza |
| **2 · Finkatu** | ámbar | Entzun eta aukeratu · Entzun pseudohitzak · Aukeratu pseudohitza |
| **3 · Erabili** | verde | Irakurri hitzak · Aukeratu irudia · **Hitzak** (constructor) |

- Los pasos conservan su **numeración global 1..9** (Hasi 1-4, Finkatu 5-7, Erabili 8-9).
- La cabecera muestra el total `n/8 ikasita`; cada etapa muestra su propio `n/m`.
- El paso `Hitza` (singular) no debe confundirse con el nivel `Hitzak` (plural).
- La estructura vive en `lib/leccion/etapas.ts` (datos + helpers testeables).

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
| Tipografía de lectura | **Edelfontmed** (`font-lectura`) para grafemas, sílabas, palabras y pseudopalabras; UI en la sans del sistema. El archivo va en `public/fonts/edelfontmed.woff2` (o `.ttf`), con `local()` como respaldo. |

### Vocales (F1.5)

Sección `Bokalek`, antes de la `m`, con cuatro actividades:

1. **Letra eta trazoa**: la vocal se dibuja sola (animación por trazos, numerados) y después se repasa en una pizarra libre. No hay corrección automática del trazo.
2. **Errepikatu: letra + hitza**: suena la letra y la palabra ancla de esa vocal; el niño repite en voz alta. Usa el reproductor de práctica (play/pausa, stop, repetir, saltar, velocidad).
3. **Entzun letra eta aukeratu**: suena una vocal y se elige su grafía entre las cinco.
4. **Entzun hitza eta aukeratu bokala**: suenan las palabras y se elige la vocal inicial; 20 rondas, una por palabra.

- Las actividades 2 y 4 se habilitan cuando existen las **20 grabaciones completas** de palabras en `public/audio/v1/vocales/palabras/`. Hasta entonces aparecen deshabilitadas con `Grabazioak falta dira`.
- Ninguna palabra de vocales se genera ni se monta con sílabas.
- Palabras: `atea, arraina, armiarma, astoa`; `elefantea, erlea, etxea, eskua`; `igela, iglu, izarra, ilargia`; `oilarra, otsoa, ogia, oina`; `untxia, urdina, ura, usoa`.
- Anclas de la actividad 2: `atea`, `elefantea`, `igela`, `oilarra`, `untxia`.

### Audio y assets

| Recurso | Ruta | Nota |
|---|---|---|
| Sílabas | `public/audio/v1/{fonema}/{silaba}.mp3` | p. ej. `m/ma.mp3` |
| Fonema aislado | `public/audio/v1/{fonema}/{fonema}.mp3` | `m/m.mp3` |
| Vocales | `public/audio/v1/vocales/{vocal}.mp3` | compartidas entre fonemas |
| Palabras | `public/audio/v1/{fonema}/{palabra}.mp3` | grabación completa; **nunca** concatenada |
| Palabras nuevas | misma ruta | las graba el equipo y se colocan a mano; el generador no las crea |
| Pseudopalabras | `public/audio/v1/pseudohitzak/{pseudopalabra}.mp3` | TTS pregenerado, dividido y normalizado |
| Fotos | `public/img/v1/palabras/{palabra}.png` | también se aceptan webp/jpg/jpeg/svg |
| Manifest | `lib/audio-provider/manifest.ts` | duraciones reales medidas con `ffprobe` |
| Verificación | `npm run audio:check` | claves ↔ archivos, duración, silencios, formato |
| Generación | `npm run audio:generar` | solo pseudopalabras; las palabras nunca se generan, se graban |
| Normalización | `node scripts/normalizar-audio.mjs` | recorta y unifica todo el audio; guarda copia en `originales/` |

- **Todo el audio de producción está normalizado**: mono 44,1 kHz, sin silencio inicial ni cola (sílabas 222–359 ms, palabras 394–608 ms, vocales 264–454 ms, pseudopalabras 490–524 ms).
- La fuente **Edelfontmed** está en `public/fonts/edelfontmed.ttf` y se sirve por `@font-face`.
- Las palabras se ofrecen en la lección si existe su audio completo; en el **constructor** solo si **todas sus sílabas** tienen audio (evita fichas mudas).

- **Las 8 palabras son grabaciones reales** (`ama`, `amama`, `mamua`, `mimo`, `momia`, `umea`, `meloi`, `musu`), normalizadas a 44,1 kHz y sin silencios de cola. Los originales están en `public/audio/v1/m/originales/` (excluido de la validación).
- **Ninguna palabra se construye uniendo sílabas**. Si falta la grabación completa, la palabra no se ofrece; se pide la grabación al equipo. El runtime tampoco hace fallback a sílabas y el generador solo crea pseudopalabras.
- Las **pseudopalabras nuevas** son TTS (20:51), divididas y normalizadas. El TTS venía en este orden: `memi, memu, mumo, mimu, moma, mume` + un séptimo `mume` duplicado que se descarta (guardado en `pruebas/pseudohitzak/extra-7-mume.mp3`). Cada archivo se ha validado con reconocimiento limitado a las 6 palabras.
- Las **vocales nuevas** se obtuvieron de un TTS de 5 segmentos (`a, e, i, o, u`), se dividieron y normalizaron; la fuente y los recortes crudos están en `vocales/originales/`. Pendiente: sustituirlas por grabaciones humanas si se graban.

#### Requisitos de una sílaba para concatenar

| Parámetro | Objetivo |
|---|---|
| Silencio inicial | 0–30 ms |
| Silencio final | 0–50 ms |
| Duración útil | 250–400 ms |
| Formato | mono, 44,1 kHz, MP3 96–128 kbps |
| Volumen | homogéneo entre sílabas (~−16 LUFS) |
| Voz | misma persona y tono en todas las sílabas |

- El generador recorta **ambos extremos** de cada sílaba antes de unirlas con `acrossfade` (150 ms por defecto, configurable con `--crossfade=<ms>`).
- Herramientas: `node scripts/analizar-audio.mjs` (mide silencios) y `node scripts/probar-concatenacion.mjs` (genera variantes en `public/audio/v1/pruebas/`, excluida de la validación).

### Datos y privacidad

- RLS obligatoria desde la primera migración.
- Nombres reales permitidos en Gela; sin datos sensibles más allá de lo necesario.
- El modo invitado no envía datos a ningún servidor.


## 3. Inventario de la letra `m`

- Sílabas: `ma, me, mi, mo, mu` + fonema aislado `m`.
- Palabras validadas (con foto): `mamua`, `umea`, `mimo`, `ama`, `amama`, `momia`, `meloi`, `musu`.
- Palabras-ancla por sílaba: `ma → mamua`, `me → meloi`, `mi → mimo`, `mo → momia`, `mu → musu`.
- Pseudopalabras: `memi, mimu, mumo, moma, memu, mume`.

## 4. Pendientes

| # | Tipo | Pendiente | Responsable |
|---|---|---|---|
| 1 | Contenido | Audios de las sílabas `loi` y `su` para poder construir `meloi` y `musu` en `Hitzak` | Equipo |
| 2 | Decisión | ¿`Hurrengo ariketa` de `Segida` al terminar debe ir al paso 3 o al menú? (ahora va al paso 3) | Equipo |
| 3 | Calidad | Sustituir los **TTS** actuales de vocales y pseudopalabras por grabaciones humanas si se graban | Equipo |
| 4 | Producto | Completar `Bokalek`: integrar las grabaciones de palabras y validar el trazo con niños | Equipo |
| 5 | Producto | Selector de formato por ejercicio: **minúsculas / mayúsculas / mezclado** (persistido). Diseño: `FormatoTexto`, aplicado con `text-transform` y, en mixto, por letra. | Equipo |
| 6 | Deuda | `/login` no existe (el botón de la landing da 404) | Dev |
| 7 | Deuda | Conectar Supabase, auth adulto, alumnos sin email y progreso en base de datos (Gela) | Dev |
| 8 | Deuda | e2e del flujo Gela completo (requisito del proyecto) | Dev |
| 9 | Futuro | Trazo/escritura de la letra (canvas) | Equipo |
| 10 | Contenido | Grabaciones completas de las 20 palabras de vocales en `public/audio/v1/vocales/palabras/` (incluida `ilargia.mp3`) | Equipo |
| 11 | Futuro | Kinestemas (gestos asociados a fonemas), después de cerrar las vocales | Equipo |

## 5. Fases

| Fase | Contenido | Estado |
|---|---|---|
| **F0** | Esqueleto, catálogo, modo invitado con la `m`, audio estático, tests base | Hecho |
| **F1 (actual)** | Refinar la `m`: lección de 9 pasos, menú por etapas, audio de calidad, vocabulario validado | En curso |
| **F1.5** | Sección de **vocales** previa a la `m` (`Bokalek`) | En curso |
| **F2** | Escalar a `k, t, l, b, p, d, n, f, g, r, rr, j, s, x, z, ts, tx, tz` (el código ya es genérico; solo faltan audios, fotos y palabras) | Pendiente |
| **F3** | Modo **Gela**: Supabase, auth del adulto, alumnos, progreso en base de datos | Pendiente |
| **F4** | Familia/informes cualitativos (sin notas ni rankings) | Pendiente |

## 6. Cómo trabajar en este repo

```
npm run dev           # http://localhost:3000/invitado
npm test              # lógica (Vitest)
npm run test:e2e      # flujo real (Playwright, usa Chrome instalado, puerto 3100)
npm run audio:check   # valida audios contra el manifest
npm run audio:generar # regenera solo pseudopalabras
node scripts/normalizar-audio.mjs  # recorta y unifica todo el audio de producción
node scripts/analizar-audio.mjs   # mide silencios inicial/final de cada audio
node scripts/probar-concatenacion.mjs  # variantes de unión en public/audio/v1/pruebas/
npm run build
```

Regla de trabajo: cualquier decisión nueva se añade a este documento en el mismo cambio que la implementa.

