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
| Contenido | MDX + Zod | Pendiente (Fase 2) |
| Estado/persistencia | Zustand + Dexie (IndexedDB) | Pendiente (Fase 3) |
| PWA | Service worker con precache | Pendiente (Fase 3) |
| Backend | Ninguno | — |

## Estructura

```
/CLAUDE.md                     instrucciones para Claude Code (<200 líneas)
/.claude/rules/                reglas por ruta (audio, contenido)
/docs/                         fuente de verdad del proyecto
/e2e/                          tests Playwright
/public/                       estáticos; font/ y soundfont/ los copia alphatab-vite (ignorados en git)
/src/audio/                    context.ts (AudioContext compartido), beatClock/accents/tapTempo/tempoLadder (puros) + metronome.ts, notePlayer.ts
/src/components/               componentes React: Fretboard/ (layout.ts puro + SVG), FretboardExplorer, Metronome/MetronomePanel, TabPoc
/src/content/exercises/*.atex  ejercicios en alphaTex, importados con ?raw
/src/theory/                   tunings, notation (anglo/latina, grados), catalog (escalas/arpegios/intervalos), fretboard
/src/state/                    (Fase 3) stores + IndexedDB
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

### alphaTab (`src/components/TabPoc.tsx`)

- `alphatab-vite` configura los web workers y audio worklets, y copia `font/` y `soundfont/` a `public/`.
- Se usa `PlayerMode.EnabledSynthesizer` con `soundfont/sonivox.sf2`.
- La instancia de `AlphaTabApi` vive en un `useRef` (es mutable) y se destruye al desmontar.
- Afinación de bajo en alphaTex: `\tuning (G2 D2 A1 E1)`, de aguda a grave. La cuerda 1 es G y la 4 es E.

## Dependencias externas en runtime

Ninguna. Fuentes y soundfont se sirven desde el propio origen.
