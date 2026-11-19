# Fuente de lectura

Coloca aquí el archivo de **Edelfontmed** con uno de estos nombres exactos (minúsculas):

- `edelfontmed.woff2` (recomendado)
- `edelfontmed.woff`
- `edelfontmed.ttf`

Se carga con `@font-face` en `app/globals.css` y se aplica con la clase `font-lectura` a grafemas, sílabas, palabras y pseudopalabras.

Si el archivo no está, se intenta la fuente instalada en el sistema (`local("Edelfontmed")`) y, si tampoco, una sans de respaldo.
