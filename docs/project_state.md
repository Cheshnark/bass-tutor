# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 0 (especificación y andamiaje), casi cerrada

### Hecho

- Proyecto Vite 8 + React 19 + TypeScript 6 estricto, oxlint, Vitest, Playwright y CI en GitHub Actions.
- **PoC metrónomo** (`src/audio/`): reloj puro testeado (6 tests, incluido "sin deriva en 10 min con jitter")
  y una capa Web Audio con lookahead de 25 ms / 100 ms. Tiene compás, subdivisión, ±5 BPM y pilotos visuales.
- **PoC alphaTab** (`src/components/TabPoc.tsx`): ejercicio original `fundamental-quinta.atex` renderizado
  como partitura + tab en afinación de bajo, con reproducción, velocidad y bucle.
- Verificado en el navegador de escritorio: render correcto, soundfont cargado, reproducción y metrónomo
  funcionando, sin errores en consola. A 375 px no hay scroll horizontal de página.
- e2e (Chromium de escritorio + Pixel 7 emulado): 6/6 en verde.
- Docs: business, architecture, decisions, spec, roadmap, todos y research.

### Falta para cerrar la Fase 0

- Probarlo en **tu móvil real** (ver [todos.md](todos.md) › Fase 0).
- Confirmar que el primer run de CI pasa.

## Siguiente paso inmediato

Probar la PoC en el móvil (`npm run dev -- --host` y abrir la IP local desde el teléfono).
Después, **Fase 1, entregable "mástil SVG"**: `src/theory/` (afinaciones + nota por cuerda/traste con Tonal.js)
con tests y componente `<Fretboard/>` con 4/5/6 cuerdas y modo zurdo.
