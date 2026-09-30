# Arquitectura

## Stack

| Capa | Elección | Estado |
|---|---|---|
| Lenguaje | TypeScript 6 (`strict`) | ✅ |
| Build/dev | Vite 8 + `@vitejs/plugin-react` | ✅ |
| UI | React 19 (SPA) | ✅ |
| Tablatura/partitura + reproducción | `@coderline/alphatab` 1.8 + `@coderline/alphatab-vite` | ✅ PoC |
| Teoría musical | `tonal` 6 | Instalado, sin usar aún (Fase 1) |
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
/src/audio/                    beatClock.ts (lógica pura, testeada) + metronome.ts (Web Audio)
/src/components/               componentes React (por ahora, las PoC)
/src/content/exercises/*.atex  ejercicios en alphaTex, importados con ?raw
/src/theory/                   (Fase 1) wrappers de Tonal.js, afinaciones, mapeo de mástil
/src/state/                    (Fase 3) stores + IndexedDB
```

## Piezas clave

### Metrónomo (`src/audio/`)

- `BeatClock` es **puro**: dado un origen y el tempo, devuelve los ticks con `time < until`.
  Cada instante se calcula como `origin + n * secondsPerTick` (sin sumas acumuladas, así que no hay deriva).
  Al cambiar el tempo se re-ancla en el próximo tick pendiente.
- `Metronome` crea el `AudioContext` en `start()` (tiene que venir de un gesto del usuario, por iOS).
  Un `setInterval` de 25 ms **solo despierta** al planificador, que programa osciladores con 100 ms
  de margen (`osc.start(tick.time)`). El piloto visual lee `currentTick()` en `requestAnimationFrame`
  comparando con `ctx.currentTime`.

### alphaTab (`src/components/TabPoc.tsx`)

- `alphatab-vite` configura los web workers y audio worklets, y copia `font/` y `soundfont/` a `public/`.
- Se usa `PlayerMode.EnabledSynthesizer` con `soundfont/sonivox.sf2`.
- La instancia de `AlphaTabApi` vive en un `useRef` (es mutable) y se destruye al desmontar.
- Afinación de bajo en alphaTex: `\tuning (G2 D2 A1 E1)`, de aguda a grave. La cuerda 1 es G y la 4 es E.

## Dependencias externas en runtime

Ninguna. Fuentes y soundfont se sirven desde el propio origen.
