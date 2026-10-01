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

## 2026-09-30 · Contenido redactado por Claude con fuentes contrastadas y vídeos enlazados
- **Motivo:** el autor toca pero no es profesor, así que no puede validar la pedagogía. Se compensa con: contraste de
  al menos dos fuentes por indicación técnica (tabla en pedagogy.md), un vídeo gratuito de una fuente reconocida por
  tema técnico, el autor como alumno probador (`borrador` → `revisada`) y una clase suelta con un profesor recomendada.
- **Descartado:** app como compañera de un curso existente (StudyBass/BassBuzz). Menos trabajo, pero el autor quiere
  un curso propio para compartir.

## 2026-09-30 · Tronco común + itinerarios por estilo
- **Motivo:** propuesta del autor. Coincide con los métodos: técnica y ritmo comunes primero; los estilos como
  vehículo de su *feel*. `module.yaml` lleva `track` (`comun` · `rock-pop` · `funk-soul` · `blues-jazz` · `metal-punk`).
- Orden del curso: tronco común y después cada itinerario. Una lección solo puede depender del tronco común o de su
  propio itinerario. "Siguiente lección" no salta de itinerario: al acabar el tronco común se elige en el índice.

## 2026-09-30 · Vídeos enlazados, no incrustados (`<Video>`)
- **Motivo:** funciona offline sin romper la lección, no carga rastreadores de terceros y no reproduce contenido ajeno
  dentro de la app. Solo `https://`; cada URL se verifica (título y canal vía oEmbed) antes de usarla.

## 2026-09-30 · Digitación de la mano izquierda: 1-2-4 en trastes bajos
- **Motivo:** no hay consenso entre métodos; es la opción más citada como segura para la mano en los primeros trastes
  (pedagogy.md). Se pasa a un dedo por traste a partir del 5.º–7.º traste.

## 2026-09-30 · Copia propia de los recursos de alphaTab (`alphaTabAssets`)
- **Motivo:** `@coderline/alphatab-vite` copia `font/` y `soundfont/` a `public/` en cada arranque. En Windows, con el
  soundfont abierto, falló con EBUSY y tumbó el servidor de dev al reiniciar. Se usa `alphaTab({ assetOutputDir: false })`
  y un plugin propio que copia solo si falta o cambia de tamaño, y si el destino está bloqueado sigue con la copia existente.

## 2026-09-30 · `remark-gfm` en las lecciones
- **Motivo:** MDX solo entiende CommonMark; las tablas de las lecciones se pintaban como texto. Las tablas se muestran
  compactas y, si no caben, se desplazan ellas (nunca la página). Mejor tablas de 2 columnas para el móvil.

## 2026-09-30 · Persistencia: progreso en IndexedDB (Dexie), ajustes en localStorage
- **Motivo:** research.md §5.2. El progreso crece (historial de intentos) y necesita consultas; los ajustes son un
  objeto pequeño que se lee al arrancar. Todo lo recuperado se valida/sanea (un localStorage manipulado o de otra
  versión no debe romper nada).
- **Copia exportable (JSON)** + `navigator.storage.persist()`: mitigan el riesgo de iOS/almacenamiento (research §11).
  La importación valida antes de pedir confirmación y antes de borrar nada.

## 2026-09-30 · Completar una lección exige un intento de cada ejercicio
- **Motivo:** research.md §11 ("la app se vuelve pasiva"): la lección no se da por hecha solo leyéndola.
  Pase limpio = todos los criterios de autoevaluación marcados; el mejor tempo limpio alimenta el tempo sugerido.

## 2026-09-30 · Service worker con aviso, no con actualización automática
- **Motivo:** una recarga automática cortaría el metrónomo en mitad de una práctica. El aviso es un banner en el
  flujo (no flotante) para no tapar la barra Anterior/Siguiente.

## 2026-09-30 · Lighthouse 12+ ya no tiene categoría PWA
- El criterio "Lighthouse PWA ≥ 90" se sustituye por: rendimiento, accesibilidad y buenas prácticas ≥ 90 (medido:
  98/100/100 en la portada y 97/100/100 en una lección, móvil) + e2e de funcionamiento sin conexión.

## 2026-09-30 · Despliegue en GitHub Pages, activado por el autor
- **Motivo:** el repositorio es público y Pages es gratuito; la ruta con hash no necesita reescrituras. El workflow
  solo publica si se lanza a mano o si existe la variable `PAGES_ENABLED=true`: la decisión de publicar es del autor.

## 2026-09-30 · Dev server en el puerto 5180
- **Motivo:** el 5173 lo usa otro proyecto local (retro-engine).

## 2026-10-01 · Itinerario metal/punk: púa por defecto y temario en 4 módulos
- **Motivo:** la púa es el ataque típico de los dos estilos (StudyBass: el metal "suena bien" con púa; Wikipedia:
  el *downpicking* es la base del punk y del thrash). Se admite tocar con dedos: hay referentes del metal que lo
  hacen y todos los ejercicios se pueden tocar con alternancia índice-medio.
- Orden del temario: ataque y pulso (púa, palm mute, corchea punk) → ritmo (semicorcheas, galope, resistencia) →
  lenguaje (drop D, riffs, escala menor y cromatismos) → tocar con la banda. Detalle en pedagogy.md.
- Las preferencias del autor (púa o dedos, metal o punk primero) no se pudieron preguntar; se eligió la opción
  recomendada. Revisable al probar el módulo 1.

## 2026-10-01 · Carpetas de módulo por bloques de decenas; número visible relativo al itinerario
- **Motivo:** el número de carpeta es único en todo el curso (lo exige `content:check`) y fija el orden. Un bloque de
  decenas por itinerario (metal/punk = 40–49) deja sitio para crecer sin renumerar. El alumno ve 1, 2, 3… dentro de
  cada itinerario (`moduleNumber` en `src/content/course.ts`); en el tronco común se mantiene 0–5.
- En el índice, los módulos de un itinerario usan `h5` (van bajo el `h4` del itinerario) para no romper la jerarquía.

## 2026-10-01 · Notación de púa en alphaTex: `{sd}`/`{su}` y `{pm}`
- **Motivo:** alphaTab 1.8 los entiende y los dibuja (⊓/V y línea P.M.), y el instrumento `Electric Bass Pick`
  (programa GM 34) suena con ataque de púa. Comprobado parseando los ejercicios con alphaTab y en el navegador.

## 2026-10-01 · Galope con golpe al aire (abajo-(arriba)-abajo-arriba)
- **Motivo:** es lo que enseña Fundamental Changes (Rob Thorpe), y Riffhard también recomienda alternar (Wikipedia
  solo define el ritmo). Una sola fuente detallada: **fuente débil**, revisar con un vídeo. La mano mantiene el péndulo de
  semicorcheas y todos los pulsos empiezan hacia abajo, así el ritmo no se desordena. La partitura marca solo los
  golpes que suenan; el golpe al aire se explica en el texto.
- Se cuenta "1 e y a" (adaptación del "1 e & a" de los métodos en inglés), coherente con el "1 y" del tronco común.

## 2026-10-01 · `<Fretboard tuning="…">`: afinación fija en un mástil de lección
- **Motivo:** la lección de drop D necesita mostrar el mástil en esa afinación aunque el alumno tenga la estándar.
  Se fija solo en ese mástil (el resto de la app sigue los ajustes) y se indica con un rótulo. Validado en
  `content:check` contra `TUNINGS`. Alternativa descartada: pedir al alumno que cambie los ajustes (más pasos y
  hoy los ajustes no están accesibles desde la lección).

## 2026-10-01 · Metal/punk módulo 3 entero en drop D
- **Motivo:** cambiar de afinación entre lecciones es incómodo y la D al aire es la nota pedal de todos los riffs
  del módulo. La lección 1 enseña a afinar y comprobar de oído; la última recuerda volver a la estándar.

## 2026-10-01 · Ejercicios con batería y guitarra (pistas extra en el alphaTex)
- **Motivo:** el módulo "Tocar con la banda" necesita algo con lo que encajar. alphaTab dibuja solo la primera pista
  (`api.tex(tex)` sin `tracks`) pero genera MIDI de todas, y el soundfont (Sonivox) trae kits de batería (banco 128).
  Comprobado: canal 9 con la percusión en el MIDI, y en el navegador solo aparece el bajo. Sin ficheros de audio:
  todo sigue siendo texto, offline y original. Los backing tracks de la Fase 5 pueden partir de aquí.

## 2026-10-01 · La reproducción de la partitura sigue el tempo de práctica
- **Motivo:** con un selector de velocidad del 50 al 110 % no se podía tocar con la batería al tempo objetivo (punk a
  170 desde una partitura a 120). `TabView` recibe `bpm` (el sugerido o el escrito en la tarjeta) y ajusta
  `playbackSpeed = bpm / tempo de la partitura`. El selector muestra BPM y el alumno puede elegir otro; si cambia el
  tempo de práctica, manda el nuevo. La velocidad se vuelve a aplicar si alphaTab se recrea.

## 2026-10-01 · Leitner calculado del historial, por día
- **Motivo:** la caja que se guardaba subía con cada pase limpio, así que tres pases el mismo día (subiendo el tempo)
  mandaban el siguiente repaso a 21 días. Ahora caja y fecha se **derivan del historial** agrupado por día local:
  primer día → caja 1; día suspendido (último intento del día no limpio) → caja 1; día aprobado en la fecha o
  después → sube una caja; práctica extra antes de la fecha → no cambia nada. Sin migraciones: cambiar las reglas o
  los intervalos de una lección recalcula todo. El campo `box` se mantiene como copia informativa.
- Intervalos: `review.afterDays` de la lección del ejercicio (por defecto 1, 3, 7, 21 días; la última se repite en la
  caja 5). research.md §1.1: espaciado de días, no de minutos, y sin prometer milagros.

## 2026-10-01 · Rutinas: plantillas fijas que alternan tipos de tarea
- **Motivo:** research.md §4 (calentamiento → técnica → mástil → groove) y §1.1 (alternancia: Carter y Grahn 2016,
  evidencia limitada). Nunca hay dos bloques seguidos del mismo tipo. Solo se usan ejercicios ya practicados (no se
  mete material nuevo en una rutina), empezando por los que toca repasar. El tipo de un ejercicio sale de sus
  etiquetas (`exerciseKind`). Temporizador solo visual (no suena): la regla de audio sobre `currentTime` no aplica.

## 2026-10-01 · Quiz de mástil sin puntuación ni cuenta atrás
- **Motivo:** research.md pide una app tranquila, "sin juegos ni puntuaciones", pero también "encontrar notas contra
  reloj". Término medio: se mide el tiempo de respuesta y se guarda (Leitner por tarjeta), y al final de la ronda se
  muestran aciertos, tiempo medio y las notas que más cuestan; no hay marcador ni límite de tiempo.
- Las tarjetas se identifican por la cuerda al aire con octava (`nombrar:E1:5`), no por el índice: con otra afinación
  (drop D, 5 cuerdas) son tarjetas distintas, como en el instrumento.
- En la casilla preguntada, el nombre accesible no incluye la nota (no se revela la respuesta con lector de pantalla).

## 2026-10-01 · Afinador: YIN propio sobre señal diezmada, sin librerías
- **Motivo:** research.md recomienda YIN o MPM con ventana ≥ 4096, bloqueo de rango por cuerda y comprobación de
  octava. YIN cabe en unas 60 líneas puras y testeables. Diezmar 48 kHz → 12 kHz reduce el coste ~16 veces sin perder
  precisión en la fundamental del bajo (error medido < 0,7 cents con tono sintético). No se usa una librería (p. ej.,
  `pitchy`, que implementa MPM; no la he evaluado): sería una dependencia más para algo que se prueba bien en casa.
- Marcado **experimental**: el micro del móvil y el procesado de iOS son el punto débil (research.md). Se ofrece el tono
  de referencia como alternativa y se recomienda un afinador de pinza.
- No se muestra lectura hasta tener 3 seguidas: las primeras ventanas tras activar el micro o pulsar la cuerda son
  inestables (visto en el e2e con micro simulado).

## 2026-10-01 · Backing tracks generados a partir de `backing.harmony`
- **Motivo:** el contenido ya declaraba la armonía por compás. Generar batería y acordes en alphaTex (texto, sin
  ficheros de audio ni derechos) da acompañamiento a todos esos ejercicios, offline y al tempo de práctica.
  Los ejercicios que ya traen sus pistas no se tocan. `content:check` comprueba un acorde por compás.
- Se puede silenciar el bajo para tocar tú su parte con la banda.

## 2026-10-01 · Oído: intervalos melódicos, de quinta y octava a todos
- **Motivo:** research.md (módulo "Oído": intervalos, identificar fundamentales). Se empieza por 4P, 5P y 8P porque son
  los saltos de las primeras líneas del curso. Mismo Leitner que el quiz (tabla `cards`). Dictado rítmico e
  identificar fundamentales quedan pendientes.

## 2026-10-01 · Paleta "crema y negro" con acento ámbar (decisión abierta n.º 2, tomada por Claude)
- **Motivo:** el autor pidió seguir con la opción recomendada. Es la primera propuesta de research.md §6.2, la más
  cercana a la provisional (oscuro + ámbar) y evita el naranja dominante. Revisable: los colores son tokens CSS.
- Sin combinar los rasgos de Orange: ni naranja dominante, ni marco *picture frame* (la placa es un rótulo simple), ni
  pictogramas (todo con texto en español), ni escudo, ni rotulación redondeada.
- Skeuomorfismo solo en el marco: placa crema "cepillada", rejilla, tolex sutil fuera de los paneles, piloto y VU. El
  contenido (lecciones, mástil, tablatura) sigue plano.

## 2026-10-01 · Rótulos en Oswald autoalojada; texto en la sans del sistema
- **Motivo:** research.md §6.2 pide una sans condensada industrial para rótulos y una muy legible para el texto. Oswald
  (OFL 1.1) va empaquetada con `@fontsource/oswald` (2 pesos, solo latín): funciona sin conexión y no llama a CDN.
  Solo en rótulos (nombre, pestañas, títulos de panel, escala del VU); los títulos de lección y el texto, en la sans.

## 2026-10-01 · Tema automático + alto contraste; modo atril
- Tema "auto" por defecto: alto contraste si el sistema lo pide (`prefers-contrast: more`). Ambos temas pasan axe
  WCAG 2.2 AA en todas las vistas.
- Modo atril (ajuste persistente): sin cabecera ni pestañas, letra a 21 px, todo el ancho y la cabecera de la lección
  reducida al título (en horizontal la altura es poca). Se activa desde la lección o desde Ajustes.
- Los objetivos de la lección van plegados en el modo paso a paso (en el móvil ocupaban el primer paso entero).

## 2026-10-01 · Fase 7: "Ampliación común" como itinerario compartido
- **Motivo:** los módulos 4–12 del currículo original ya no encajan tal cual: lo básico está en el tronco común y lo de
  cada estilo, en su itinerario. Arpegios, escalas, groove y lectura valen para todos: van a un itinerario nuevo,
  `ampliacion` (carpetas 50–59), que se muestra tras el tronco común y cuyas lecciones pueden ser prerrequisito de
  cualquier estilo (`SHARED_TRACKS`). No se metió en el tronco común para no alargar el camino hasta elegir estilo.
- Arpegios y escalas en **quinta posición** (La en el traste 5): las formas de StudyBass son de un dedo por traste y
  así no contradicen la digitación 1-2-4 de los trastes bajos.
- Ejercicios generados con verificación nota a nota contra Tonal (grado y pertenencia al acorde/escala) y con la
  **digitación en la partitura** (`{lf}`). La verificación detectó un error en una línea escrita a mano (G en vez de
  G# en La mayor); otro (una nota fuera del acorde en un tiempo fuerte) lo vi al releerla, y ahora también se comprueba.

## 2026-10-01 · Shuffle escrito en tresillos
- **Motivo:** alphaTab reproduce las corcheas rectas tal cual (no aplica swing), y el ejercicio tiene que sonar con su
  balanceo. Lo habitual en partitura es escribir corcheas con la indicación "shuffle"; la lección lo explica. Con
  `feel: shuffle` la batería generada va en tresillos y coincide con el bajo.
- Groove sobre cuerdas al aire (A, D, E): toda la atención al ritmo, sin carga de mano izquierda.

## 2026-10-01 · Lectura: ejercicios solo de partitura, en primera posición
- **Motivo:** con la tablatura delante no se aprende a leer. `\staff { score }` oculta la tablatura solo en esos
  ejercicios. Primera posición con 1-2-4 (mano quieta, como recomienda StudyBass para leer sin mirar las manos).
  El ritmo se practica primero sobre una sola nota.

## 2026-10-01 · Rock/pop: temario de 4 módulos, dedos por defecto
- **Motivo:** el itinerario se apoya en lo ya escrito (corcheas, 1-5-8, arpegios y escalas de la ampliación) y añade
  lo propio del estilo: longitud de nota por secciones, aproximaciones, progresiones de cuatro acordes, acordes con
  barra, riffs y la estructura de canción. Las lecciones usan prerrequisitos de la ampliación común (escala mayor,
  tríadas), que el esquema permite.
- La aproximación por la quinta se enseña sobre I–vi–IV–V y no sobre I–IV–V: en I–IV–V la quinta del acorde siguiente
  casi siempre es la fundamental del actual y el ejercicio no enseñaría nada.
