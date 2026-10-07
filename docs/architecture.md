# Arquitectura

## Stack

| Capa | Elección | Estado |
|---|---|---|
| Lenguaje | TypeScript 6 (`strict`) | ✅ |
| Build/dev | Vite 8 + `@vitejs/plugin-react` | ✅ |
| UI | React 19 (SPA) | ✅ |
| Tablatura/partitura + reproducción | `@coderline/alphatab` 1.8 + `@coderline/alphatab-vite` | ✅ PoC |
| Teoría musical | `tonal` 6.4.3 (versión exacta, ver decisions.md) | ✅ `src/theory/` |
| Audio propio | Web Audio nativo | ✅ metrónomo |
| Lint | oxlint (lo trae la plantilla oficial de Vite) | ✅ |
| Tests unitarios | Vitest 5 (entorno `node`) | ✅ |
| Tests e2e | Playwright (Chromium escritorio + Pixel 7) | ✅ |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | ✅ |
| Contenido | Zod 4 + YAML + MDX (`@mdx-js/rollup`, `remark-mdx`) + plugin `virtual:course` | ✅ esquema, validación, carga y render |
| Estado/persistencia | Zustand (+ `persist` en localStorage para ajustes y metrónomo) + Dexie (IndexedDB) para el progreso | ✅ |
| PWA | `vite-plugin-pwa` (Workbox): precache de todo el curso, manifest, iconos (`@vite-pwa/assets-generator`) | ✅ |
| Despliegue | GitHub Pages (`.github/workflows/deploy.yml`, `BASE_PATH=/bass-tutor/`) | Preparado; lo activa el autor |
| Backend | Ninguno | — |

## Estructura

```
/CLAUDE.md                     instrucciones para Claude Code (<200 líneas)
/.claude/rules/                reglas por ruta (audio, contenido)
/docs/                         fuente de verdad del proyecto
/e2e/                          tests Playwright
/public/                       estáticos; font/ y soundfont/ los copia alphatab-vite (ignorados en git)
/src/audio/                    context.ts (AudioContext compartido), beatClock/accents/tapTempo/tempoLadder/pitch (puros) + metronome.ts, notePlayer.ts, tuner.ts
/src/App.tsx, useHashRoute.ts  navegación por hash (#/curso, #/curso/<id>, #/mastil…)
/src/components/               Fretboard/, FretboardExplorer, Dictionary/, Metronome/, Knob/ (pote), PanelTitle, Lesson/ (índice, lección, embeds), Practice/ (repaso, rutinas, quiz), Tab/ (TabView diferido), SettingsBar
/src/practice/                 leitner.ts, queue.ts, routine.ts, quiz.ts, ear.ts: lógica pura de la práctica (Fases 4–5)
/src/content/                  schema.ts (Zod), validate.ts + mdx.ts + frontmatter.ts (puros), course.ts (acceso tipado);
                               modules/NN-id/ (module.yaml + *.mdx); exercises/*.yaml
/scripts/                      course-source.ts (lee disco + alphaTex en Node), content-check.ts, vite-plugin-course.ts,
                               vite-plugin-alphatab-assets.ts (copia font/ y soundfont/ a public/ si cambian)
/src/theory/                   tunings, notation (anglo/latina, grados), catalog (+ textos), fretboard, dictionary
/src/state/                    settings.ts y metronome.ts (Zustand + localStorage); progress/ (model.ts puro, db.ts Dexie, hooks.ts)
```

## Piezas clave

### Metrónomo (`src/audio/`)

- `BeatClock` es **puro**: dado un origen y el tempo, devuelve los ticks con `time < until`.
  Cada instante se calcula como `origin + n * secondsPerTick` (sin sumas acumuladas, así que no hay deriva).
  Al cambiar el tempo se re-ancla en el próximo tick pendiente. Cada tick lleva `bar` y `bpm`.
  `collect(until, onBarStart)` permite cambiar el tempo exactamente en un primer tiempo (escalera).
- Piezas puras: `accents.ts` (patrón por pulso y sonido de cada tick), `tapTempo.ts`, `tempoLadder.ts`
  (modo "cada N compases" o "al marcar pase").
- `Metronome` obtiene el `AudioContext` compartido en `start()` (tiene que venir de un gesto del usuario, por iOS).
  Un `setInterval` de 25 ms **solo despierta** al planificador, que programa osciladores con 100 ms
  de margen (`osc.start(tick.time)`). El piloto visual lee `currentTick()` en `requestAnimationFrame`
  comparando con `ctx.currentTime`.
- **Motor único** (`src/state/metronome.ts`): `metronomeEngine` + store de Zustand. Lo controlan el panel y los
  `<Metronome/>` de las lecciones. `currentTick()` no consume la cola (varios lectores a la vez).
- `MetronomePanel` (UI): lectura grande del BPM con piloto, pulsos de 56 px que editan el acento, ±1/±5,
  deslizador, Tap, Iniciar/Parar de 64 px, compás, subdivisión, volumen y escalera (`<details>`).

### Mástil (`src/theory/` + `src/components/Fretboard/`)

- `buildFretboard(tuning, view)` (puro) devuelve cada posición cuerda/traste con midi, nombre con la ortografía
  del conjunto, `inSet`, `isRoot` e intervalo desde la fundamental. `FretboardView` coincide con el modelo de
  contenido (`mode`, `root`, `type`, `frets`, `labels`), así las lecciones podrán incrustar vistas del mástil.
- `computeLayout(...)` (puro) calcula la geometría; el zurdo es `x' = ancho − x`.
- `<Fretboard/>` pinta el SVG: diapasón, marcadores, trastes/cejuela, cuerdas (más gruesas las graves),
  números y notas. Cada casilla es pulsable y suena con `playNote(midi)`. Las notas visibles son
  focusables (`role="button"`, Enter/Espacio).
- Afinaciones de grave a aguda (índice 0 = la más grave, dibujada abajo).

### Diccionario (`src/theory/dictionary.ts` + `src/components/Dictionary/`)

- `describeEntry(kind, id, root)` (puro): fórmula en grados, notas, semitonos y pasos (T/S/1½T) o intervalos
  entre notas del arpegio, más el texto del catálogo.
- `ascendingMidis(entry, lowest)`: notas para "Escuchar" en registro de bajo, sin bajar de la cuerda más grave.
- La vista reutiliza `<Fretboard/>` con los ajustes globales.

### Contenido (`src/content/`) — guía: [content-guide.md](content-guide.md)

- **Esquema Zod** (`schema.ts`): `ModuleSchema` (module.yaml), `LessonMetaSchema` (frontmatter), `ExerciseSchema`
  (YAML con el alphaTex dentro) y `FretboardEmbedSchema` (props de `<Fretboard/>` en el MDX). Mensajes en español
  (`z.config(z.locales.es())`). Ids = nombres de fichero; orden de módulos = prefijo `NN-`; orden de lecciones = module.yaml.
- **Validación** (`validate.ts`, pura): esquema por fichero + referencias cruzadas (lecciones listadas ↔ ficheros,
  ejercicios existentes, prerrequisitos anteriores, ids únicos) + alphaTex (el comprobador se inyecta). Errores y avisos.
- **`scripts/content-check.ts`**: lee el disco, parsea alphaTex con alphaTab en Node (diagnósticos con línea/columna)
  y sale con código 1 si hay errores. `npm run build` lo ejecuta primero. Tiene su propio `tsconfig.scripts.json`.
- Pasos de lección = encabezados `##` del cuerpo MDX (modelo `Step` de research.md adaptado).
- **`mdx.ts`** analiza el MDX sin ejecutarlo (unified + remark-mdx): pasos, componentes con props evaluadas solo si
  son literales, y construcciones prohibidas (import/export, expresiones). Los errores dan la línea real del fichero.
- **Carga en la app**: `scripts/vite-plugin-course.ts` expone `virtual:course` = curso validado como JSON (sin Zod ni
  yaml en el navegador); en dev invalida y recarga al cambiar `src/content`; si hay errores, falla el build.
  Los ejercicios van **sin `alphaTex`** (`ExerciseMeta`); los textos están en `virtual:course-tex` (id → alphaTex),
  un chunk aparte (~110 kB, 11 kB gz) que `playableTex()` importa al mostrar la primera partitura
  (`components/Tab/ExerciseTab.tsx`). Offline, queda precacheado como el resto.
  Los `.mdx` se compilan con `@mdx-js/rollup` (+ `remark-frontmatter`) y se cargan con `import.meta.glob`: un chunk
  por lección. `lessonComponents` mapea `<Exercise/>`, `<Fretboard/>`, `<Tab/>`, `<Metronome/>` a componentes React.
- **Pasos**: `src/content/remarkLessonSteps.ts` (plugin de remark, en `vite.config`) envuelve cada `##` de primer
  nivel y su contenido en `<LessonStep index>`. En modo "siguiendo la clase" `LessonStep` solo monta el paso actual
  (contexto `LessonStepContext`). `analyzeMdx` cuenta los mismos pasos (y rechaza `##` anidados).
- **Modo seguimiento** (`LessonView`): paso en la URL (`#/curso/<id>/<n>`, 1-based), barra de progreso enlazable,
  barra inferior fija Anterior/Siguiente (56 px), teclas ←/→ y RePág/AvPág (pedales Bluetooth), foco al título
  del paso, y Screen Wake Lock (`useWakeLock`) mientras se sigue la clase. `lessonMode` en `useSettings`.
- `TabView` (alphaTab) se carga con `React.lazy`: el bundle principal pasó de 1,61 MB a 285 KB.

### Progreso y persistencia (`src/state/progress/`)

- `model.ts` (puro): `applyAttempt` (mejor tempo limpio, caja de Leitner informativa, historial ≤ 200), `suggestTempo`
  (mejor limpio + paso, sin pasar del objetivo), `canCompleteLesson` (≥ 1 intento por ejercicio) y la validación de
  la copia exportada (`parseProgressExport`, sin Zod para no cargarlo en el navegador).
- `db.ts` (Dexie, BD `bass-tutor`, versión 2): tablas `exercises`, `lessons` y `cards` (quiz); `recordAttempt`,
  `recordCardAnswer`, `completeLesson`,
  `saveLastStep`, `exportProgress`/`importProgress` (valida antes de borrar) y `requestPersistence` (Storage API).
- `hooks.ts`: `useLiveQuery` de dexie-react-hooks; la UI se actualiza sola al guardar.
- UI: `ExerciseCard` (registrar intento; pase limpio = todos los criterios marcados), `LessonCompletion`,
  `CourseIndex` (✓, n/m por módulo, "Sigue en el paso N") y `ProgressPanel` (exportar/importar JSON).
- Ajustes y configuración del metrónomo: `persist` de Zustand en localStorage, saneados al recuperar.
- Copia exportable v2 (añade `cards`); se siguen importando copias v1.

### Práctica inteligente (`src/practice/` + `src/components/Practice/`)

- `leitner.ts`: caja y fecha de repaso **calculadas del historial** agrupado por día local (el último resultado del
  día cuenta); intervalos de `review.afterDays` de la lección (por defecto 1, 3, 7, 21). Nada de esto se guarda.
- `queue.ts`: cola del día (vencidos; más atrasados y caja más baja primero) y próximo día con repasos.
- `routine.ts`: plantillas de 15/30/45 min que alternan tipos de tarea; tipo de ejercicio por etiquetas; elige
  primero lo que toca repasar y no repite ejercicio.
- `quiz.ts`: tarjetas "nombrar" (casilla → nota) y "encontrar" (nota + cuerda → casilla), con el mismo Leitner;
  ronda de 10 (vencidas, nuevas, resto). Las notas salen de `src/theory/fretboard.ts` (`fretPitch`, `chromaNames`).
- UI en `#/practica`: `DailyQueue` (cola + tarjetas pendientes), `RoutinePlayer` (`#/practica/rutina/30`, bloques con
  temporizador visual y Wake Lock) y `FretboardQuiz` (`#/practica/quiz`; `Fretboard` con `marks`). `PracticeReminder`
  avisa en el índice del curso.

### PWA y despliegue

- Workbox precachea ~7,6 MB (39 ficheros): app, lecciones, alphaTab (worker y worklet), `Bravura.woff2` y
  `sonivox.sf2`. `registerType: 'prompt'`: `UpdatePrompt` avisa de versiones nuevas sin recargar en mitad de una práctica.
- `base` configurable con `BASE_PATH` (GitHub Pages sirve en `/bass-tutor/`); probado offline bajo esa ruta.
- En e2e el service worker está bloqueado salvo en `e2e/offline.spec.ts`.

### Audio avanzado (Fase 5)

- **Afinador** (`src/audio/pitch.ts` puro + `src/audio/tuner.ts` + `components/Tuner/`): YIN (CMND, umbral, mínimo
  local, interpolación parabólica) sobre 8192 muestras diezmadas a ~12 kHz, ~15 análisis por segundo en
  `requestAnimationFrame`. Rango 28–400 Hz en automático; con cuerda elegida, ± media octava (evita errores de
  octava). Mediana de 5 lecturas y mínimo de 3 antes de mostrar. Micro sin cancelación de eco, supresión de ruido ni
  control de ganancia. Tono de referencia sostenido por cuerda. Pruebas: [afinador-pruebas.md](afinador-pruebas.md).
  El estado y el audio van en el hook `components/Tuner/useTuner.ts`; `Tuner.tsx` solo pinta.
- **Utilidades compartidas** (`src/`): `storage.ts` (`localStorage` que no lanza), `useNow.ts` (hora para contadores) y
  `components/Practice/RadioGroup.tsx` (opciones excluyentes del quiz y el oído).
- **Backing tracks** (`src/content/backing.ts`): para ejercicios con `backing.harmony` y una sola pista, se añaden al
  alphaTex una batería (según compás y *feel*; tresillos en swing/shuffle) y acordes en piano eléctrico
  (`src/theory/voicing.ts`, disposición cerrada). `playableTex` (course.ts) lo memoriza. `content:check` exige una
  entrada por compás (con uno o varios acordes que repartan los pulsos: `"Cm7 F7"`, ver `barChords`/`chordsFitBar`)
  y parsea el resultado con alphaTab. En `TabView`, botones para silenciar el bajo o el
  acompañamiento (`changeTrackMute`).
- **Oído** (`src/practice/ear.ts` + `components/Practice/EarTraining.tsx`, `#/practica/oido`): intervalos melódicos
  en el registro del bajo (E1–C3), con Leitner por intervalo en la tabla `cards` (`oido:5P`); al responder, el
  intervalo se dibuja en el mástil. Las dos notas se programan sobre el reloj de audio (`playSequence`).
- **Grábate** (`components/Lesson/Recorder.tsx`): MediaRecorder en la tarjeta de ejercicio; se escucha ahí mismo y
  no se guarda.

### Tema y accesibilidad (Fase 6)

- Tokens CSS en `src/index.css` (`:root`); `[data-theme='alto-contraste']` los redefine y `[data-stand='on']` aplica
  el modo atril. `useAppearance` (src/useAppearance.ts) pone `data-theme` y `data-stand` en `<html>`: tema elegido o,
  en "auto", alto contraste si `prefers-contrast: more`.
- Ajustes en `#/ajustes` (`SettingsView`): instrumento, tema, modo atril y paso a paso. `useSettings` guarda `theme` y
  `standMode` (validados al recuperar).
- Cabecera "cabezal": placa crema con el **logotipo** (nombre + cuatro cuerdas, enlace al curso; no es el `h1`),
  `HeaderPilot` (piloto que luce con el pulso, vía `useBeatPulse`, y enlaza al metrónomo) y enlace a Ajustes; debajo,
  rejilla decorativa. En modo atril, una barra mínima.
- **Nombre visible** en `src/brand.ts` (`APP_NAME`): cabecera, `document.title`, manifest (vite.config.ts) y avisos.
  Los identificadores internos (`bass-tutor` en rutas, copias de progreso y claves de almacenamiento) no dependen de él.
- **Rótulo de panel** (`components/PanelTitle.tsx`): tira crema con tornillos; es el `h1` de cada vista (en la lección,
  el `h1` es el título de la lección). Niveles: `h1` vista → `h2` secciones → `h3`… `document.title` por vista
  (`App.tsx`; la lección pone el suyo).
- **Pilotos** (`.pilot`, `.pilot--on`, `.pilot--flash`): cristal ámbar con bisel; el ámbar (`--accent`, `--lit-*`)
  se reserva para lo encendido. Botón principal en crema (`--primary-*`); marcas de traste en `--inlay`.
- **Pote** (`components/Knob/`): `role=slider` con teclado (flechas, RePág/AvPág, Inicio/Fin) y arrastre vertical;
  lógica pura en `knobMath.ts` (con tests). Metrónomo: tempo (20–300) y volumen (0–10), siempre con ± y entrada.
- **Tolex por itinerario**: `data-track` en los bloques del índice y en la lección; colores `--tolex` en index.css,
  banda en Lesson.css. Sin banda en los bloques comunes ni en alto contraste.
- Afinador con `VuMeter` (SVG, `role=meter`). Fuentes autoalojadas (OFL): Oswald para rótulos (`@fontsource/oswald`)
  y Atkinson Hyperlegible Next para el texto (`@fontsource/atkinson-hyperlegible-next`, 400/400 cursiva/700, ~12 KB
  cada peso).
- Pruebas: `e2e/a11y.spec.ts` (axe, WCAG 2.2 AA, ambos temas) y `e2e/design.spec.ts` (≥ 48 px, tema, atril, piloto).
  Guía: [accesibilidad.md](accesibilidad.md).

### Navegación

- `useHashRoute` + pestañas en la cabecera (Curso · Práctica · Mástil · Diccionario · Metrónomo · Afinador), con parámetros
  (`#/curso/<lección>/<paso>`). `MetronomePanel` siempre montado (oculto) para seguir sonando; el resto se monta al activarse.

### alphaTab (`src/components/Tab/TabView.tsx`)

- `alphatab-vite` configura los web workers y audio worklets (`assetOutputDir: false`); `alphaTabAssets` copia
  `font/` y `soundfont/` a `public/` solo si faltan o cambian (evita el EBUSY de Windows al reiniciar).
- Se usa `PlayerMode.EnabledSynthesizer` con `soundfont/sonivox.sf2`.
- La instancia de `AlphaTabApi` vive en un `useRef` (es mutable) y se destruye al desmontar.
- Afinación de bajo en alphaTex: `\tuning (G2 D2 A1 E1)`, de aguda a grave. La cuerda 1 es G y la 4 es E.

## Dependencias externas en runtime

Ninguna. Fuentes y soundfont se sirven desde el propio origen.
