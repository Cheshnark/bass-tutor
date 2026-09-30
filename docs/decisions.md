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

## 2026-09-30 · Zustand adelantado a la Fase 1 (sin persistencia)
- **Motivo:** mástil y diccionario comparten afinación, zurdo y nomenclatura (modelo `Settings` de research.md).
  Un store global evita duplicar estado y migrarlo después. La persistencia en IndexedDB sigue en la Fase 3.

## 2026-09-30 · Navegación por hash (`#/mastil`, `#/diccionario`, `#/metronomo`, `#/tablatura`)
- **Motivo:** sin dependencias (no hace falta un router), funciona offline y sin reescrituras en el hosting.
- **El metrónomo está siempre montado** (oculto con `hidden`) para que siga sonando al cambiar de vista.
  El resto de vistas se montan solo cuando están activas (alphaTab no maqueta bien en un contenedor oculto).

## 2026-09-30 · Diccionario: datos de Tonal, textos curados
- **Motivo:** fórmula, notas, pasos e intervalos se calculan siempre con Tonal (nada a mano). En el catálogo solo va
  el texto para el usuario (`summary`, `usage`), que hay que revisar como cualquier contenido pedagógico.
- Pasos de escala en español: T (tono), S (semitono), 1½T. Arpegios: intervalo entre notas consecutivas.
- "Escuchar" programa toda la secuencia de golpe sobre el reloj de audio; el `setTimeout` del componente solo
  reactiva el botón y no dispara sonido.

## 2026-09-30 · Dobles alteraciones como ♭♭ / ♯♯
- **Motivo:** 𝄫 y 𝄪 (U+1D12B/U+1D12A) no están en muchas fuentes de sistema de móvil y saldrían como cuadros.

## 2026-09-30 · Formato del contenido: YAML + MDX, ids desde el nombre de fichero
- **Ejercicios en un único YAML** con el alphaTex en un bloque `|` (en vez de `.atex` + metadatos aparte): un solo
  fichero por ejercicio es más fácil de escribir a mano, y en un bloque `|` las barras invertidas no se escapan.
  Los ejercicios son un banco común referenciado por id (reutilizables en lecciones y rutinas).
- **Ids desde el nombre de fichero/carpeta**, no escritos dentro: no pueden desincronizarse.
- **Orden**: módulos por prefijo `NN-`; lecciones por la lista de `module.yaml` (única fuente; sin `order` en la lección).
- **Pasos = encabezados `##`** del cuerpo MDX, en vez de un array `steps` tipado (research.md §7): escribir prosa en MDX
  es natural y los componentes (`<Fretboard/>`, `<Tab/>`…) van dentro de cada paso.
- **`status: borrador | revisada`** en lecciones y ejercicios: lo que genera Claude es borrador hasta que el autor lo toca.
- **Mínimo un ejercicio por lección** en el esquema: mitiga el riesgo "la app se vuelve pasiva" de research.md §11.

## 2026-09-30 · `content:check` con alphaTab en Node y tsx
- **Motivo:** el importador de alphaTex funciona en Node y da diagnósticos con línea y columna; así los errores de
  notación se ven en el build, no en el navegador. También comprueba que `timeSignature` coincide con el `	s`.
- `tsx` ejecuta el script (importa código de `src/` sin extensiones, que Node puro no resuelve).
- Errores rompen el build; avisos (borradores, ejercicios sin usar) no.

## 2026-09-30 · Contenido en la app vía `virtual:course` (JSON validado en build)
- **Motivo:** la validación (Zod, yaml, alphaTab) solo corre en Node; el navegador recibe JSON ya validado y los MDX
  compilados. Así no viajan Zod ni yaml, y un contenido roto nunca llega a producción (el plugin falla el build).
- El plugin reutiliza `scripts/course-source.ts`, igual que `content:check`: una sola implementación.
- `import.meta.url` en vez de `import.meta.dirname` (Vite reescribe el primero al empaquetar `vite.config`).
- `tsconfig.node.json` pasa a `moduleResolution: bundler` (vite.config importa scripts/ sin extensión).

## 2026-09-30 · Componentes MDX con props literales, validadas estáticamente
- **Motivo:** el contenido lo escribe una persona (o Claude en borrador). Analizar el MDX sin ejecutarlo y admitir
  solo literales permite validar las props con Zod en build y dar errores con la línea del fichero.
  Se prohíben `import`/`export` y expresiones `{…}` (solo comentarios).

## 2026-09-30 · Metrónomo como motor único en un store (Zustand)
- **Motivo:** el `<Metronome/>` de una lección y el panel tienen que ser el mismo metrónomo (un solo clic, mismo tempo).
  El store llama al motor en cada acción (sin efectos que sincronicen). `syncBpm` refleja la escalera sin reenviar.

## 2026-09-30 · Vista "Curso" por defecto; fuera la vista "Tablatura"
- La tablatura se ve ahora dentro de las lecciones (`<Exercise/>`, `<Tab/>`). La PoC ya no tiene vista propia.

## 2026-09-30 · "Siguiendo la clase": pasos agrupados en compilación, solo se monta el actual
- **Agrupar en compilación** (plugin de remark) en vez de dividir el DOM: cada paso es un subárbol React propio y el
  modo completo reutiliza el mismo MDX.
- **Solo se monta el paso actual**: alphaTab no maqueta bien dentro de un contenedor oculto (ancho 0). El estado
  que importa (metrónomo) es global, así que no se pierde nada al cambiar de paso.
- **Paso en la URL** (`#/curso/<id>/<n>`): recargar mantiene el paso y "atrás" vuelve al anterior.
- **Teclas ←/→ y RePág/AvPág**: es lo que envían los pedales de pasar página Bluetooth (manos ocupadas con el bajo).
  El paso se lee del hash en cada pulsación: con pulsaciones rápidas, el valor del render estaba desfasado (lo
  detectó un e2e).
- **Wake Lock** solo en modo seguimiento; se vuelve a pedir al volver a la pestaña. Si no está o se deniega, se dice.
- Modo por defecto: seguimiento (research.md §4: "modo siguiendo la clase" como forma principal de usar la lección).

## 2026-09-30 · Dev server en el puerto 5180
- **Motivo:** el 5173 lo usa otro proyecto local (retro-engine).
