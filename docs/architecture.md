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
/src/audio/                    context.ts (AudioContext compartido), beatClock/accents/tapTempo/tempoLadder (puros) + metronome.ts, notePlayer.ts
/src/App.tsx, useHashRoute.ts  navegación por hash (#/curso, #/curso/<id>, #/mastil…)
/src/components/               Fretboard/, FretboardExplorer, Dictionary/, Metronome/, Lesson/ (índice, lección, embeds), Tab/ (TabView diferido), SettingsBar
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

- `model.ts` (puro): `applyAttempt` (mejor tempo limpio, caja de Leitner 1–5, historial ≤ 200), `suggestTempo`
  (mejor limpio + paso, sin pasar del objetivo), `canCompleteLesson` (≥ 1 intento por ejercicio) y la validación de
  la copia exportada (`parseProgressExport`, sin Zod para no cargarlo en el navegador).
- `db.ts` (Dexie, BD `bass-tutor`): tablas `exercises` y `lessons`; `recordAttempt`, `completeLesson`,
  `saveLastStep`, `exportProgress`/`importProgress` (valida antes de borrar) y `requestPersistence` (Storage API).
- `hooks.ts`: `useLiveQuery` de dexie-react-hooks; la UI se actualiza sola al guardar.
- UI: `ExerciseCard` (registrar intento; pase limpio = todos los criterios marcados), `LessonCompletion`,
  `CourseIndex` (✓, n/m por módulo, "Sigue en el paso N") y `ProgressPanel` (exportar/importar JSON).
- Ajustes y configuración del metrónomo: `persist` de Zustand en localStorage, saneados al recuperar.

### PWA y despliegue

- Workbox precachea ~7,6 MB (39 ficheros): app, lecciones, alphaTab (worker y worklet), `Bravura.woff2` y
  `sonivox.sf2`. `registerType: 'prompt'`: `UpdatePrompt` avisa de versiones nuevas sin recargar en mitad de una práctica.
- `base` configurable con `BASE_PATH` (GitHub Pages sirve en `/bass-tutor/`); probado offline bajo esa ruta.
- En e2e el service worker está bloqueado salvo en `e2e/offline.spec.ts`.

### Navegación

- `useHashRoute` + pestañas en la cabecera (Curso · Mástil · Diccionario · Metrónomo), con parámetros
  (`#/curso/<lección>/<paso>`). `MetronomePanel` siempre montado (oculto) para seguir sonando; el resto se monta al activarse.

### alphaTab (`src/components/Tab/TabView.tsx`)

- `alphatab-vite` configura los web workers y audio worklets (`assetOutputDir: false`); `alphaTabAssets` copia
  `font/` y `soundfont/` a `public/` solo si faltan o cambian (evita el EBUSY de Windows al reiniciar).
- Se usa `PlayerMode.EnabledSynthesizer` con `soundfont/sonivox.sf2`.
- La instancia de `AlphaTabApi` vive en un `useRef` (es mutable) y se destruye al desmontar.
- Afinación de bajo en alphaTex: `\tuning (G2 D2 A1 E1)`, de aguda a grave. La cuerda 1 es G y la 4 es E.

## Dependencias externas en runtime

Ninguna. Fuentes y soundfont se sirven desde el propio origen.
