# Guía de contenido

Cómo se escriben módulos, lecciones y ejercicios. El esquema que lo valida está en
[`src/content/schema.ts`](../src/content/schema.ts) y se comprueba con:

```bash
npm run content:check
```

Se ejecuta también antes de cada `npm run build`. **Los errores rompen el build; los avisos no.**

## Dónde va cada cosa

```
src/content/
  modules/
    00-arranque/            ← carpeta NN-<id>: el número es el orden del módulo
      module.yaml           ← título, resumen y orden de las lecciones
      cuerdas-al-aire.mdx   ← una lección (id = nombre del fichero)
  exercises/
    cuerdas-al-aire-negras.yaml   ← un ejercicio (id = nombre del fichero)
```

- Los **ids salen del nombre** del fichero o carpeta, en minúsculas, sin tildes y con guiones (`fundamental-quinta`).
  No se escriben dentro del fichero.
- Los **ejercicios son un banco común**: una lección los referencia por id y otra lección (o una rutina) puede reutilizarlos.

## Módulo: `module.yaml`

```yaml
title: Arranque
summary: Partes del bajo, afinación, postura y primeras notas con metrónomo.
track: comun        # comun | ampliacion | rock-pop | funk-soul | blues-jazz | metal-punk (por defecto, comun)
lessons:            # orden de estudio; única fuente del orden
  - cuerdas-al-aire
```

Toda lección `.mdx` de la carpeta tiene que estar en `lessons`, y todo lo listado tiene que existir.

**Número de carpeta**: es único en todo el curso. Cada itinerario usa su propio bloque de decenas:

| Itinerario | Carpetas |
|---|---|
| Tronco común | `00`–`09` |
| Ampliación común | `50`–`59` |
| Rock/pop | `10`–`19` |
| Funk/soul | `20`–`29` |
| Blues/jazz | `30`–`39` |
| Metal/punk | `40`–`49` |

El alumno no ve ese número: en un itinerario, los módulos se muestran como 1, 2, 3… según su orden.

## Lección: `<id>.mdx`

Frontmatter YAML y, debajo, el cuerpo en Markdown/MDX.

```yaml
---
title: Cuerdas al aire con metrónomo
level: principiante          # principiante | intermedio
status: borrador             # borrador | revisada
durationMin: 15
objectives:                  # qué sabrás hacer al terminar (mínimo 1)
  - Tocar las cuatro cuerdas al aire en negras, a tiempo
prerequisites: []            # ids de lecciones ANTERIORES en el curso
concepts: [pulso, negra]     # opcional
exercises:                   # mínimo 1: toda lección termina tocando
  - cuerdas-al-aire-negras
review:                      # opcional; por defecto [1, 3, 7, 21]
  afterDays: [1, 3, 7, 21]
---
```

**Cada `## Título` del cuerpo es un paso** del modo "siguiendo la clase": una pantalla, con texto grande y el botón
"Siguiente" abajo. Hace falta al menos uno. Los `###` son subapartados dentro del paso.

- Los `##` tienen que ir al nivel principal, nunca dentro de un componente (es un error de `content:check`).
- Lo que escribas antes del primer `##` se muestra junto al primer paso.
- Piensa cada paso como **una pantalla de móvil**: una idea, y como mucho un componente grande (`<Exercise/>`, `<Fretboard/>`).

Plantilla de pasos recomendada (docs/research.md §10):

1. `## Objetivo`
2. `## Por qué importa`
3. `## Cómo se hace` (demostración)
4. `## Ejercicio` (tempo inicial y objetivo)

Las tablas Markdown funcionan (GFM). En móvil, mejor de **2 columnas**: con más, no caben con el texto grande.
5. `## Errores comunes`
6. `## Autoevaluación`

### Componentes que puedes usar en el cuerpo

Solo estos cuatro. Las props tienen que ser **literales** (textos, números, listas): nada de código.
`content:check` valida nombre, props y referencias, y da la **línea del fichero** si algo falla.

| Componente | Qué pinta | Ejemplo |
|---|---|---|
| `<Exercise id="…" />` | Tarjeta del ejercicio: instrucciones, tempo, botón de metrónomo, partitura con reproducción y autoevaluación | `<Exercise id="cuerdas-al-aire-negras" />` |
| `<Fretboard … />` | Mástil (usa la afinación, el zurdo y la nomenclatura de los ajustes) | `<Fretboard mode="scale" root="A" type="minor pentatonic" frets={[0, 5]} labels="degree" />` |
| `<Tab exercise="…" />` | Solo la partitura + tab de un ejercicio, con reproducción | `<Tab exercise="fundamental-quinta" />` |
| `<Metronome … />` | Botón que arranca el metrónomo de la app a ese tempo | `<Metronome bpm={60} beatsPerBar={4} />` |
| `<Video url="…" title="…" source="…" />` | Tarjeta que enlaza una demostración externa (se abre en otra pestaña) | `<Video url="https://www.youtube.com/watch?v=…" title="…" source="BassBuzz" />` |

- `<Fretboard>`: `mode` = `notes` · `scale` · `arpeggio` · `interval`; `root` y `type` en nomenclatura de Tonal
  (los del diccionario); `frets` por defecto `[0, 12]`; `labels` = `note` · `degree` · `interval`.
  `tuning` (opcional) fija la afinación de ese mástil (`drop-d-4`, `standard-5`… ids de `src/theory/tunings.ts`)
  por encima de la de los ajustes; úsalo solo si la lección trata de esa afinación. Se muestra un rótulo.
- Todo ejercicio de `exercises` del frontmatter debería aparecer con `<Exercise id="…" />` (si no, aviso), y todo
  `<Exercise>` del cuerpo tiene que estar en `exercises` (si no, error).
- No se permiten `import`/`export` ni expresiones `{…}`; sí comentarios `{/* nota */}`.

## Ejercicio: `<id>.yaml`

```yaml
title: Cuerdas al aire en negras
status: borrador
instructions: >-
  Toca cada cuerda al aire en negras…
tempo:
  start: 60      # BPM inicial
  target: 80     # BPM objetivo (≥ start)
  step: 4        # cuánto subir en cada pase limpio
timeSignature: 4/4          # tiene que coincidir con el \ts del alphaTex
feel: straight              # straight | swing | shuffle (opcional)
backing:                    # opcional
  harmony: [F7, Bb7, F7, F7]   # cifrado que Tonal reconozca
passCriteria:               # autoevaluación (mínimo 1)
  - Cada nota cae con el clic
tags: [cuerdas-al-aire, mano-derecha]
alphaTex: |
  \track "Bajo" { instrument "Electric Bass Finger" }
  \staff { score tabs }
  \tuning (G2 D2 A1 E1)
  \clef bass
  \ts (4 4)
  :4 0.4 0.4 0.4 0.4
```

- `alphaTex` va en un bloque `|` de YAML: las barras invertidas se escriben tal cual.
- **Ojo con los dos puntos**: una línea de lista con `: ` dentro (`- Aprietas lo justo: puedes…`) YAML la lee como
  un objeto. Ponla entre comillas: `- "Aprietas lo justo: puedes…"`. `content:check` lo detecta.
- `content:check` **parsea el alphaTex con alphaTab** y da línea y columna del error
  (líneas contadas dentro del bloque de alphaTex, no del YAML).
- Afinación en alphaTex: de la cuerda aguda a la grave (`G2 D2 A1 E1`); la cuerda 1 es G.
- **Cifrado sobre la partitura**: pon `{ch "G"}` detrás de la primera nota del acorde (`3.4 {ch "G"} 3.4 3.4 3.4`).
  Si el ejercicio tiene acordes, añade también `backing.harmony` (un acorde por compás).
- **Digitación** (dedos de la mano izquierda): `{lf N}` pegado a la nota, con N = dedo + 1 (`lf 2` índice … `lf 5`
  meñique; `lf 1` es el pulgar). alphaTab dibuja el número del dedo junto a la nota: `5.4{lf 3}` = traste 5 con el
  dedo 2.
- **Groove**: nota muerta `0.3{x}`; acento `0.3{ac}`; dinámica en el pulso `0.3 {dy p}` (sigue hasta el siguiente
  `dy`); ligadura con la nota anterior `0.2{t}` (no se vuelve a pulsar); tresillo `:8 0.3 {tu 3} 0.3 {tu 3} 0.3 {tu 3}`.
- **Shuffle**: escríbelo en tresillos (`:4 R {tu 3} :8 R {tu 3}` por pulso) y pon `feel: shuffle`: la reproducción
  de alphaTab no "swinguea" corcheas rectas, y así la batería generada también va en shuffle.
- **Púa** (itinerario metal/punk): `instrument "Electric Bass Pick"`. Dirección de cada golpe como efecto del pulso,
  `{sd}` hacia abajo (⊓) y `{su}` hacia arriba (V). **Palm mute** como efecto de la nota, pegado a ella: `0.4{pm}`.
  Se combinan así: `0.4{pm} {sd ch "E5"}`. Acordes de quinta (*power chords*): `E5`, `C5`…
- **Acompañamiento** (batería, guitarra): pistas extra **después** de la del bajo. Solo se dibuja la primera pista
  (el bajo), pero suenan todas. Batería:

  ```
  	rack "Batería"
  \instrument percussion
  \clef neutral
  rticulation defaults
  :8 (KickHit HiHatClosed) HiHatClosed (SnareHit HiHatClosed) HiHatClosed …
  ```

  Guitarra: `	rack "Guitarra" { instrument "Distortion Guitar" }`, `\staff { tabs }` y
  `	uning (E4 B3 G3 D3 A2 E2)`. Todas las pistas tienen que tener el mismo número de compases.
- La reproducción suena al **tempo de práctica** del alumno (el sugerido o el que escriba), no al `	empo` del
  alphaTex: escribe `	empo` igual a `tempo.start` y no te preocupes por el resto.

## Vídeos

- Solo fuentes reconocidas y gratuitas; **verifica** título y canal antes de enlazar (por ejemplo con
  `https://www.youtube.com/oembed?url=<url>&format=json`) y añádelo a la tabla de [pedagogy.md](pedagogy.md).
- El vídeo apoya el texto: comprueba que muestra lo mismo que explica la lección.

## Estado: `borrador` y `revisada`

Todo lo que genera Claude empieza como `borrador`. Pasa a `revisada` **cuando lo has tocado tú** y te parece
correcto. `content:check` avisa de cada borrador para que no se queden olvidados.

## Derechos

Solo ejercicios originales o de dominio público. Nada de tablaturas, letras ni audio de canciones con copyright.
