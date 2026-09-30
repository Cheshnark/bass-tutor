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

## 2026-09-30 · Tonal.js fijado en 6.4.3 exacto
- **Motivo:** la 6.5.0 (publicada el 2026-09-28) declara `main: dist/index.js` y `types: dist/index.d.ts`,
  pero solo publica `index.mjs`/`index.cjs`. Node y TypeScript no la resuelven. La 6.4.3 sí incluye esos ficheros.

## 2026-09-30 · Mástil: afinaciones de grave a aguda; ortografía según el conjunto
- **Motivo:** coincide con el modelo de research.md (`["B0","E1",...]`). La pertenencia a la escala o al
  arpegio se decide por *chroma*, pero el nombre sale de la ortografía de Tonal para ese conjunto
  (Bb mayor → Eb, no D#; F# mayor → E#). Fuera de un conjunto: sostenidos, o bemoles si la fundamental lleva bemol.
- La conversión a alphaTex (de aguda a grave) está centralizada en `toAlphaTexTuning`.

## 2026-09-30 · Grados con alteración relativa a mayor/justa (♭3, ♭7, ♯4)
- **Motivo:** es la notación habitual en bajo para arpegios y *chord tones*. Se deriva del intervalo de Tonal.
  Los intervalos se muestran con "J" (justa) en vez de la "P" de Tonal.

## 2026-09-30 · Geometría del mástil pura y zurdo calculado (no `scale(-1)`)
- **Motivo:** un `transform` invertiría el texto. Con `x' = ancho − x` el espejo es exacto y testeable
  (criterio de aceptación de la Fase 1).
- **Estrechamiento de trastes:** la mitad del real (`2^(-1/24)` por traste). Con el real, el traste 24 mide la
  mitad del 1 y es difícil de pulsar en el móvil. El mástil no se encoge: si no cabe, se desplaza dentro de su caja.
- **Orientación:** la cuerda grave abajo, como en la tablatura.

## 2026-09-30 · Un único AudioContext compartido (`src/audio/context.ts`)
- **Motivo:** metrónomo y notas del mástil suenan a la vez; iOS limita los contextos y cada uno necesita
  su gesto de desbloqueo. `Metronome.dispose()` ya no cierra el contexto, solo desconecta su salida.

## 2026-09-30 · Escalera de tempo decidida dentro del reloj, en el primer tiempo
- **Motivo:** el planificador programa con 100 ms de antelación. Si la UI cambiara el tempo "cuando se entera",
  el salto caería a mitad de compás. `BeatClock.collect(until, onBarStart)` consulta el hook justo antes de emitir
  cada primer tiempo y se re-ancla en ese mismo instante. Cada `Tick` lleva su `bpm` y `bar`, y la UI muestra el
  tempo cuando el tick suena.
- **Consecuencia:** con la escalera activa, la UI no envía BPM al metrónomo (evita deshacer una subida recién
  programada) y los controles de tempo se desactivan.

## 2026-09-30 · Acentos editables desde los propios pilotos
- **Motivo:** una sola pulsación grande (56 px) por pulso, sin menús: acento → normal → silencio. El "silencio"
  quita también las subdivisiones de ese pulso, para practicar el pulso interno.

## 2026-09-30 · Tap tempo en `pointerdown`, media de los últimos 6 toques
- **Motivo:** `click` salta al soltar y añade la variación de lo que dura la pulsación. Se reinicia tras 2 s sin tocar.

## 2026-09-30 · Columnas de grid con `minmax(0, 1fr)` en `.app-main` y `.panel`
- **Motivo:** una columna `auto` crece hasta el min-content de su hijo más ancho y provocaba 11 px de scroll
  lateral a 360 px. Detectado por el e2e de móvil.

## 2026-09-30 · Dev server en el puerto 5180
- **Motivo:** el 5173 lo usa otro proyecto local (retro-engine).
