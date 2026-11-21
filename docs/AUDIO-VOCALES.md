# Audio de las vocales

> Regla: las palabras se **graban completas**. No se generan uniendo sílabas y no se editan
> (ni se recortan, ni se convierten, ni se normalizan). El nombre del archivo es la fuente
> de verdad de lo que contiene.

## Carpeta

```
public/audio/v1/vocales/palabras/
```

Un `.mp3` por palabra, con el nombre exacto en minúsculas. Sin espacios ni sufijos.

## Palabras confirmadas

| Vocal | Archivos |
|---|---|
| a | `atea.mp3`, `arraina.mp3`, `armiarma.mp3`, `astoa.mp3` |
| e | `elefantea.mp3`, `erlea.mp3`, `etxea.mp3`, `eskua.mp3` |
| i | `igela.mp3`, `iglu.mp3`, `izarra.mp3`, **pendiente la cuarta** |
| o | `oilarra.mp3`, `otsoa.mp3`, `ogia.mp3`, `oina.mp3` |
| u | `untxia.mp3`, `urdina.mp3`, `ura.mp3`, `usoa.mp3` |

La cuarta palabra de la `i` se ha escrito solo como `i`; hay que confirmar cuál es antes de
crear su clave.

## Sonidos de las letras

Ya existen:

```
public/audio/v1/vocales/a.mp3
public/audio/v1/vocales/e.mp3
public/audio/v1/vocales/i.mp3
public/audio/v1/vocales/o.mp3
public/audio/v1/vocales/u.mp3
```

Son TTS pregenerado. Si se graban de nuevo, se sustituyen con los mismos nombres y se
actualizan las duraciones del manifest.

## Después de grabarlas

1. Se mide cada archivo con `ffprobe` (solo lectura, sin tocarlo).
2. Se añaden las duraciones a `lib/audio-provider/manifest.ts` con la clave
   `vocales/palabras/{palabra}`.
3. `npm run audio:check` comprueba claves, archivos, duración y formato.
4. No se usa `npm run audio:generar` para palabras: ese script solo crea pseudopalabras.
