# Irakurri — decisiones, pendientes y fases

> Documento de referencia del proyecto. Si algo aquí contradice `.clinerules`, manda `.clinerules`.
> Última actualización: 19 de noviembre de 2026.

## 1. Estado actual

- **Modo invitado**: letra `m` completa (lección de 9 pasos + `Segida` + `Hitzak`).
- **Vocales**: audio de `a, e, i, o, u` listo y normalizado; falta la **sección** de vocales antes de la `m` (acordado, sin fecha).
- **Modo Gela**: no implementado. El esquema SQL (`supabase/migrations/0001_initial_schema.sql`) y las políticas RLS existen, pero **Supabase no está conectado** y `/login` todavía no existe.
- **Tests**: 66 unitarios (Vitest) y 19 e2e (Playwright).

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

Orden de la lección (9 pasos), con `Segida` como práctica tras las sílabas:

1. **Grafema**: letra + sonido aislado.
2. **Silabak**: `m + a = ma` explícito, vocal a vocal.
3. **Errepikatu**: sílabas en orden no alfabético, el niño repite en voz alta.
4. **Hitza**: palabra-ancla que empieza por la sílaba (imagen + palabra escrita + audio de palabra y de sílaba).
5. **Entzun eta aukeratu**: suena una sílaba y se elige entre las 5 (`ma…mu`). 12 rondas.
6. **Entzun pseudohitzak**: audio y **texto visible**; el niño escucha, lee y repite.
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
- Los pasos **Errepikatu**, **Hitza** y **Entzun pseudohitzak** comparten el escenario de `Segida`: fichas visibles con la actual resaltada y panel de controles al lado (debajo en móvil). El avance sigue siendo manual (`Jarraitu`) para dejar tiempo a repetir en voz alta.
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

### Audio y assets

| Recurso | Ruta | Nota |
|---|---|---|
| Sílabas | `public/audio/v1/{fonema}/{silaba}.mp3` | p. ej. `m/ma.mp3` |
| Fonema aislado | `public/audio/v1/{fonema}/{fonema}.mp3` | `m/m.mp3` |
| Vocales | `public/audio/v1/vocales/{vocal}.mp3` | compartidas entre fonemas |
| Palabras | `public/audio/v1/{fonema}/{palabra}.mp3` | grabación completa o generada |
| Palabras generadas | misma ruta | solo si no hay grabación; el script no la sobrescribe |
| Pseudopalabras | `public/audio/v1/pseudohitzak/{pseudopalabra}.mp3` | TTS pregenerado, dividido y normalizado |
| Fotos | `public/img/v1/palabras/{palabra}.png` | también se aceptan webp/jpg/jpeg/svg |
| Manifest | `lib/audio-provider/manifest.ts` | duraciones reales medidas con `ffprobe` |
| Verificación | `npm run audio:check` | claves ↔ archivos, duración, silencios, formato |
| Generación | `npm run audio:generar` | concatena sílabas con `acrossfade` (offline); `--solo=hitzak` o `--solo=pseudohitzak` |
| Normalización | `node scripts/normalizar-audio.mjs` | recorta y unifica todo el audio; guarda copia en `originales/` |

- **Todo el audio de producción está normalizado**: mono 44,1 kHz, sin silencio inicial ni cola (sílabas 222–359 ms, palabras 477–792 ms, vocales 264–454 ms, pseudopalabras 490–524 ms).
- La fuente **Edelfontmed** está en `public/fonts/edelfontmed.ttf` y se sirve por `@font-face`.
- Las palabras se ofrecen en la lección si existe su audio completo; en el **constructor** solo si **todas sus sílabas** tienen audio (evita fichas mudas).

- **Las palabras nuevas se generan con las sílabas nuevas** (`ama`, `amama`, `mamua`, `mimo`, `momia`, `umea`) y suenan con la misma voz que las sílabas; `meloi` y `musu` siguen siendo grabaciones completas. Los originales de las grabaciones están en `public/audio/v1/m/originales/` (excluido de la validación). Para regenerar solo estas palabras: `npm run audio:generar -- --forzar --solo=hitzak`.
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
| 4 | Producto | Sección de **vocales** antes de la `m` | Equipo |
| 5 | Producto | Selector de formato por ejercicio: **minúsculas / mayúsculas / mezclado** (persistido). Diseño: `FormatoTexto`, aplicado con `text-transform` y, en mixto, por letra. | Equipo |
| 6 | Deuda | `/login` no existe (el botón de la landing da 404) | Dev |
| 7 | Deuda | Conectar Supabase, auth adulto, alumnos sin email y progreso en base de datos (Gela) | Dev |
| 8 | Deuda | e2e del flujo Gela completo (requisito del proyecto) | Dev |
| 9 | Futuro | Trazo/escritura de la letra (canvas) | Equipo |

## 5. Fases

| Fase | Contenido | Estado |
|---|---|---|
| **F0** | Esqueleto, catálogo, modo invitado con la `m`, audio estático, tests base | Hecho |
| **F1 (actual)** | Refinar la `m`: lección de 9 pasos, menú por etapas, audio de calidad, vocabulario validado | En curso |
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
node scripts/normalizar-audio.mjs  # recorta y unifica todo el audio de producción
node scripts/analizar-audio.mjs   # mide silencios inicial/final de cada audio
node scripts/probar-concatenacion.mjs  # variantes de unión en public/audio/v1/pruebas/
npm run build
```

Regla de trabajo: cualquier decisión nueva se añade a este documento en el mismo cambio que la implementa.

