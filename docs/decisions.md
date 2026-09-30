# Decisiones técnicas

Formato: fecha · decisión · motivo · alternativas descartadas.

## 2026-09-30 · Web/PWA en vez de app nativa
- **Motivo:** el núcleo es contenido más herramientas deterministas (mástil, metrónomo, tab). El metrónomo
  es preciso en web si se programa sobre el reloj de Web Audio.
- **Descartado:** nativa. Solo compensaría con corrección automática por audio, que queda fuera de alcance.

## 2026-09-30 · Vite + React + TypeScript estricto (SPA)
- **Motivo:** hace falta estado persistente entre pantallas (el metrónomo sigue sonando mientras navegas)
  y React tiene el ecosistema más amplio.
- **Descartado:** Astro + islas (mejor para contenido, más fricción para el estado global de audio);
  SvelteKit (ecosistema más pequeño).

## 2026-09-30 · oxlint en lugar de ESLint
- **Motivo:** la plantilla oficial actual de `create-vite` (react-ts) trae oxlint. Es más rápido y ya
  incluye las reglas de hooks de React. No añade valor cambiarlo.

## 2026-09-30 · `@coderline/alphatab-vite` como paquete separado
- **Motivo:** es lo que indica la documentación oficial. El export `@coderline/alphatab/vite` del
  paquete principal (1.8.4) declara tipos en `dist/vite/`, que no viene publicado.

## 2026-09-30 · Fuentes y soundfont de alphaTab servidos localmente y fuera de git
- **Motivo:** funcionan offline (requisito PWA) y no dependen de ningún CDN. El plugin los regenera desde
  `node_modules` en cada build, así que no hace falta versionarlos. CI comprueba que existen en `dist/`.

## 2026-09-30 · Metrónomo: reloj puro + capa Web Audio
- **Motivo:** la lógica de tiempos se puede testear sin navegador (criterio "sin deriva en 10 min").
  `setInterval` solo despierta al planificador y nunca dispara sonido ("A Tale of Two Clocks").
- **Descartado:** Tone.js (dependencia en el núcleo más crítico, sin necesidad).

## 2026-09-30 · Nomenclatura anglosajona (C-D-E) por defecto
- **Motivo:** decisión del usuario. Coincide con cifrados, tablaturas y la mayoría de recursos.
  La latina será conmutable.

## 2026-09-30 · Playwright con 2 workers en local y 1 en CI
- **Motivo:** cada página levanta el worker de alphaTab (~2 MB). Con más workers en paralelo aparecían
  timeouts intermitentes; con 2, 3 de 3 ejecuciones en verde y más rápidas.

## 2026-09-30 · Dev server en el puerto 5180
- **Motivo:** el 5173 lo usa otro proyecto local (retro-engine).
