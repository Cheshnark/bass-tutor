# Escaneo legal del historial de git

_Fecha: 2026-10-07. Auditoría técnica, **no asesoramiento legal**._
Alcance: los 49 commits de todas las ramas (`git rev-list --all`), 1 solo autor (`Cheshnark`), todos con
`Co-Authored-By` de Claude salvo uno (hecho: 48 de 49 mensajes lo llevan).

## Resultado resumido

| Tema | Hallazgo | Preocupación |
|---|---|---|
| Tablaturas / líneas de canciones reales | **Ninguna encontrada** (ni en el árbol ni en commits antiguos) | Baja |
| Texto copiado de libros, métodos o vídeos | **No detectado** por búsqueda de nombres y de citas largas; **no se puede descartar paráfrasis cercana** sin comparar con las fuentes | Media (sin verificar) |
| Audio, samples, imágenes, fuentes de origen incierto | Todo el binario del historial son 7 iconos PNG/SVG/ICO propios. Fuentes y soundfont **no están en git** (los copia el build desde `node_modules`) | Baja en git; ver el **soundfont** en [legal-licenses.md](legal-licenses.md) |
| Contenido borrado que sigue en commits antiguos | Solo 3 archivos borrados: `public/favicon.svg` (icono propio), `src/components/MetronomePoc.tsx` y `src/content/exercises/fundamental-quinta.atex` (ejercicio de la PoC, genérico) | Baja |
| Datos personales en el historial | Los 49 commits llevan el email `alejandrorubiosuela@gmail.com` como autor | **Aviso de privacidad del autor** (ver abajo) |

Nada grave desde el punto de vista de derechos de autor. Lo más relevante está fuera del historial (soundfont,
vídeos de terceros enlazados, contenido sin revisar).

## Cómo se ha buscado (repetible)

```bash
git rev-list --all > revs.txt                       # 49 commits
R=$(tr '\n' ' ' < revs.txt)

# 1) Ficheros binarios o de medios que hayan existido alguna vez
git rev-list --all --objects | awk '{print $2}' \
  | grep -Ei '\.(mp3|wav|ogg|flac|mid|midi|gp[0-9x]?|sf2|sf3|ttf|otf|woff2?|png|jpe?g|svg|gif|pdf|mp4|webm)$' | sort -u

# 2) Archivos añadidos/borrados/renombrados distintos de texto
git log --all --diff-filter=ADR --name-status --format='--%h'

# 3) Nombres de canciones, artistas, métodos y autores, en todo el historial (git grep -il sobre cada revisión)
git grep -il -- "<término>" $R
#   términos: Smoke on the Water, Seven Nation, Another One Bites, Billie Jean, Come Together, Sunshine of Your Love,
#   Superstition, Rumble, Peter Gunn, Jaco, Flea, Geddy, Hotel California, Stand By Me, Master of Puppets, Iron Man,
#   Beatles, Led Zeppelin, Metallica, Red Hot, Motown, Jamerson, Duck Dunn, Larry Graham, Victor Wooten, Rocco Prestia,
#   Paul McCartney, Marcus Miller, Ron Carter, Paul Chambers, Mingus, Berklee, Hal Leonard, Ed Friedland, Carol Kaye,
#   Rufus Reid, Bass Player, Scott Devine, Scott's Bass Lessons, TalkingBass, Chris Fitzgerald, Beatles|Zeppelin|Sabbath|Queen

# 4) Citas largas entre comillas (>80 caracteres) en lecciones y docs
grep -rnoE "[\"“«][^\"”»]{80,}[\"”»]" src/content/modules docs/pedagogy.md docs/research.md

# 5) Copyright explícito, letras
git grep -nE -i "copyright|©|\(c\)|lyrics|letra de" <HEAD> -- src
```

Limitaciones: la búsqueda por nombres no detecta una línea de bajo reconocible si no se nombra la canción; la
comparación de melodías con obras reales **no se ha hecho** (no hay base de datos de referencia a mano).

## Qué se ha encontrado

### Canciones y artistas
- **Ningún título de canción** de la lista aparece en ningún commit. Los 49 commits solo mencionan canciones en
  `docs/` como ejemplo de lo que **no** se hace (p. ej. «No se toca ninguna línea de Jamerson», `pedagogy.md` ~l. 392).
- Nombres de músicos en lecciones (datos históricos, sin reproducir obra): James Jamerson
  (`modules/22-motown-soul/linea-motown.mdx`), Larry Graham (`modules/23-slap/slap-pulgar.mdx`), Steve Harris y Geezer
  Butler (`modules/40-pua/coger-la-pua.mdx`) y el riff de apertura del primer disco de Black Sabbath
  (`modules/42-riffs/frigio-y-tritono.mdx` ~l. 58, mencionado como curiosidad).
- **Punto a vigilar** (inferencia, no hecho): el ejercicio `exercises/riff-tritono.yaml` es un motivo de corcheas
  en re (0-0-6-5, tritono y segunda abajo, en drop D). Es un patrón corto y genérico y **no coincide nota a nota** con
  ningún riff que yo conozca con certeza, pero la lección lo vincula con Black Sabbath. Recomiendo que el autor lo
  compare de oído con el riff citado; si se parece, cambiar el motivo.
- Patrones de dominio general (no protegibles en sí): blues de 12 compases, I–V–vi–IV, I–vi–IV–V, II–V–I, patrón
  1-3-5-6-♭7 de «rock and roll», galope, walking bass. Los ejercicios son notación propia.

### Texto de terceros
- `docs/pedagogy.md` contiene una **tabla de fuentes** (StudyBass, TalkingBass, No Treble, Premier Guitar, Wikipedia,
  etc.) con la indicación «contrastada en ≥ 2 fuentes». Las lecciones se redactaron con IA a partir de ese contraste
  (`docs/decisions.md`, «Contenido redactado por Claude con fuentes contrastadas»). **No se copió texto largo**: la
  búsqueda de citas entre comillas solo encuentra títulos de vídeos y de fuentes. **Pero** no se ha comparado
  frase a frase con esas fuentes: NO VERIFICADO. Qué hacer: tomar 5–10 lecciones al azar y buscar 2–3 frases
  características en Google entre comillas.
- `docs/research.md` cita datos de Hal Leonard Bass Method y BassBuzz (cifras: páginas, número de lecciones) con
  enlace; son hechos con referencia, no copia.
- **56 enlaces únicos a vídeos de YouTube** (no incrustados, solo `<a href>`; lista en `legal-provenance.md`): BassBuzz, Scott's Bass Lessons, StudyBass, Ryan Madora, Fender, D'Addario,
  TalkingBass y otros. Enlazar no copia contenido, pero ver `legal-provenance.md`.

### Medios, fuentes e iconos
- Binarios que han existido en git: `public/{favicon.svg, icon.svg, favicon.ico, apple-touch-icon-180x180.png,
  pwa-64x64.png, pwa-192x192.png, pwa-512x512.png, maskable-icon-512x512.png}`. `icon.svg` lleva el comentario
  «Icono original de Basscraft» y los PNG/ICO se generan de él con `@vite-pwa/assets-generator`
  (`pwa-assets.config.ts`). Origen propio (hecho por el comentario y por el script; la autoría real del dibujo
  la confirma el autor).
- `public/font/` y `public/soundfont/` están en `.gitignore`: **no hay fuentes ni soundfont en el historial**.
  Se copian en cada build desde `@coderline/alphatab`.
- Ningún samples de audio: el metrónomo, la batería y los acordes se sintetizan por código.

### Datos personales
- Los 49 commits llevan el email personal del autor. Es un dato público si el repo es público. Opciones (no
  ejecutadas): (a) dejarlo; (b) usar el email `noreply` de GitHub a partir de ahora (`git config user.email`);
  (c) reescribir el historial (`git filter-repo`), que cambia todos los hashes y exige force-push: **solo con
  decisión del autor** y sin urgencia porque no hay material de terceros que retirar.

## Opciones si apareciera algo grave
Nada grave aquí. Si más adelante se descubre una pieza problemática: quitarla del árbol actual y, si hace falta
borrarla también del historial, `git filter-repo --path <ruta> --invert-paths` y force-push; las copias, forks y
cachés ya existentes no se pueden recuperar. Se propone, no se ejecuta.
