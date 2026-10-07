# Pendientes

## Fase 0: lo que queda para cerrarla

- [ ] **Probar en tu móvil** (solo se puede hacer a mano): metrónomo y reproducción de alphaTab en Chrome Android
      y/o Safari iOS. Hace falta servir en red local (`npm run dev -- --host`) o desplegar.
- [ ] Si tienes iPhone: comprobar el modo standalone (UE, iOS ≥ 17.4), `getUserMedia` y la persistencia del almacenamiento.
- [ ] iOS: comprobar si el interruptor de silencio corta el audio de Web Audio y documentarlo. **[Hipótesis]**
- [ ] Ver el primer run de CI en GitHub Actions en verde.

## Identidad

- [x] Logotipo, rótulos de panel (h1 por vista), ámbar solo para lo encendido, metrónomo como frontal, Atkinson
      Hyperlegible Next y tolex por itinerario (2026-10-05).
- [x] Nombre elegido: **Basscraft** (2026-10-06). Aplicado en `APP_NAME`, subtítulos de los ejercicios, regla de
      contenido y e2e. Ruta, carpetas e identificadores internos no cambian.
- [ ] Probar el pote en el móvil: que arrastrarlo no moleste al desplazar la página.

## Afinador

- [x] Probar con el bajo real (Amplug 3 → línea en el sobremesa): funciona con ganancia 0 dB y el medidor al 80 %.
      Anotado en [afinador-pruebas.md](afinador-pruebas.md).

## Fase 7: en curso

- [x] Ampliación común: Arpegios (3 lecciones) y Escalas (3 lecciones), en borrador.
- [x] Ampliación común: Groove y feels (síncopa, shuffle/swing, notas muertas y dinámica), en borrador.
- [ ] alphaTab dibuja una "f" de dinámica por defecto al principio de cada ejercicio; valorar ocultarla.
- [x] Ampliación común: Leer partitura (clave de Fa, ritmo leído, una línea entera), en borrador. **Ampliación completa.**
- [ ] Lectura: opción de ocultar la tablatura en cualquier ejercicio (hoy solo en los de lectura).
- [x] Rock/pop: temario y módulos 1 (El pulso del rock) y 2 (Progresiones pop), en borrador.
- [x] Rock/pop: módulo 3 (Riffs de rock: pentatónica, patrón de rock and roll, doblar el riff), en borrador.
- [x] Rock/pop: módulo 4 (La canción entera: forma, dinámica por secciones, una canción completa). **Itinerario completo.**
- [ ] alphaTab dibuja `\section` encima del cifrado del acorde; las secciones se rotulan con `txt` (texto pequeño en cursiva). Revisar si una versión nueva lo arregla.
- [ ] Buscar un vídeo verificable del patrón de rock and roll (1-3-5-6-♭7); hoy la lección va sin vídeo.
- [x] Blues/jazz: temario y módulos 1 (El blues) y 2 (Walking bass), en borrador.
- [x] Blues/jazz: módulos 3 (armonía de jazz) y 4 (tocar jazz), en borrador. **Itinerario completo.**
- [x] Blues/jazz: lección **El II–V–I menor** (m7♭5–7–m7) en el módulo 3, con 2 ejercicios (2026-10-06), en borrador.
- [ ] II–V–I menor: el V se deja en G7 por simplicidad; valorar una lección con V alterado (♭9) más adelante.
- [x] Itinerario funk/soul: 4 módulos (semicorcheas y síncopa; octavas y el uno; Motown y soul; slap), en borrador.
  **Todo el contenido de la Fase 7 está escrito.**
- [ ] alphaTab dibuja la S/P del slap encima del cifrado; hoy el acorde va como `txt`. Revisar con una versión nueva.
- [x] Vídeos de la forma del blues y del blues caminado añadidos (TalkingBass, 2026-10-06).
- [ ] Vídeos que siguen faltando (buscados el 2026-10-06 en TalkingBass sin resultado verificable): patrón de rock and
  roll, escala de blues, II–V–I (mayor y menor), AABA, el uno, Motown, 12/8. Los resultados que hay son canciones con
  copyright o cursos de pago; no se enlazan.
- [ ] **Tú**: revisión pedagógica por módulo (criterio de la fase): tocarlo y pasar a `revisada` lo que esté bien.

## Fase 6: hecha

- [x] Tema cabezal, alto contraste (y automático), Ajustes en página propia, modo atril, piloto en cabecera, VU.
- [x] axe WCAG 2.2 AA en todas las vistas y temas; controles principales ≥ 48 px.
- [ ] **Tú**: ¿te gusta la paleta crema y negro? (decisión tomada por Claude; los colores son tokens y se cambian fácil).
- [x] Reflow a 320 px, espaciado de texto y foco no tapado: medidos en e2e y corregidos (2026-10-07).
- [ ] Revisión manual de accesibilidad: orden del foco con Tab y lector de pantalla (lista en `docs/accesibilidad.md`).

## Repaso técnico (2026-10-07)

Rendimiento (medido en el build):
- [x] Ejercicios fuera del chunk de arranque (2026-10-07): el JSON del curso ya no lleva el `alphaTex`; el chunk de
      arranque baja de 715 a 607 kB (193 → 182 kB gz) y los textos van en un chunk propio de 110 kB (11 kB gz).
      Ganancia menor de la estimada (-6 % gz): las instrucciones de los ejercicios siguen en el arranque.
      Segunda parte (misma fecha): también `instructions` y `passCriteria` salen del arranque → 550 kB (165 kB gz);
      el detalle va en `virtual:course-detail` (169 kB, 30 kB gz). En total, de 715 a 550 kB (193 → 165 kB gz, -14 %).
- [x] Precarga de `TabView` medida sobre lo desplegado (5 pasadas, 2026-10-07): activa (inicio simultáneo con
      `course-detail`), efecto en la nota **no apreciable** frente al ruido (73, rango 61–86). Se mantiene.
- [ ] Si se quiere comparar cambios de rendimiento de la lección: usar métricas menos ruidosas que la nota
      (TBT, bytes y orden de peticiones) y más pasadas (≥ 10), o medir en local con red simulada fija.
- [ ] El JS del arranque tarda ~1,1 s en ejecutarse en Lighthouse móvil (TBT 440 ms en la lección): perfilar qué se
      ejecuta al arrancar (react-dom + dexie son lo mayor; el JSON del curso se parsea entero).
- [x] Tonal medido (2026-10-07): con los imports reales (`Chord`, `Interval`, `Note`, `Scale`) pesa 30 kB minificado
      / 10,6 kB gz, un 5 % del chunk de arranque (607 kB). Importar `@tonaljs/*` sueltos lo dejaría en 24 kB / 8,6 kB
      gz: -2 kB gz a cambio de reescribir los imports y perder el espacio de nombres. **No compensa; sin acción.**
      El grueso es de datos (tipos de acorde y de escala) que `Chord.get` y `Scale.get` necesitan.
- [ ] El chunk de alphaTab (1,1 MB, 275 gz) ya es perezoso; el PWA precachea ~8,3 MB en 105 entradas. Sin acción.

Refactor (sin cambiar comportamiento), hecho el 2026-10-07:
- [x] `Tuner` (309 → 156 líneas): estado y audio en el hook `useTuner`; la vista solo pinta.
- [x] `RadioGroup` común para el quiz de mástil y el oído.
- [x] `src/storage.ts` (`readStored`, `writeStored`, `readStoredObject`) en vez de dos copias.
- [x] `useNow` para los contadores del `Recorder` y del `RoutinePlayer`.
- [ ] `vite.config.ts` importa TS sin extensión: Vite avisa de que `configLoader: 'native'` será el predeterminado
      en una versión futura. `--configLoader bundle` no lo silencia (probado). Arreglarlo exige poner extensión en
      ~15 importaciones y `allowImportingTsExtensions`; se hará cuando Vite cambie el predeterminado.

## Fase 5: hecha (probada en bajo real por cable; falta el móvil)

- [x] Afinador experimental (YIN, < 0,7 cents con tono sintético), tono de referencia, backing tracks generados,
      silenciar bajo/acompañamiento, oído (intervalos), grábate.
- [x] Probar el afinador con el bajo real por cable (Windows, Chrome, línea): bien, ver `docs/afinador-pruebas.md`.
- [x] Probar el afinador con el micrófono del móvil: funciona, bastante menos preciso que por cable (ver `docs/afinador-pruebas.md`).
- [x] Afinador en el móvil probado (2026-10-06): "lo suficientemente bien".
- [x] Afinador en el móvil: **asunto cerrado** (2026-10-06). Sin más pruebas ni advertencia en la app: el autor da por
      bueno el resultado (por cable supera, a su juicio, a un afinador físico de ~40 €).
- [ ] **Tú**: escuchar la mezcla del acompañamiento (batería y piano eléctrico frente al bajo); ajustar volúmenes.
- [ ] Oído: dictado rítmico e identificar la fundamental de un acorde; intervalos armónicos (a la vez).
- [ ] Afinador: si la E grave falla en móviles, probar MPM o una ventana más larga; calibración de La (440 Hz fijo).
- [ ] Grábate: hoy no se guarda; valorar guardar la última grabación por ejercicio (IndexedDB) para comparar.
- [ ] Backing: más estilos de batería por ejercicio (hoy un ritmo de rock genérico por compás/feel).

## Fase 4: hecha

- [x] Leitner por días calculado del historial; cola diaria; rutinas 15/30/45 con alternancia; quiz de mástil.
- [ ] **Tú**: usar la Práctica varios días seguidos y comprobar que la cola tiene sentido (¿demasiados repasos?
      ¿intervalos cortos o largos?). Los intervalos por defecto (1, 3, 7, 21 días) son una propuesta.
- [ ] Quiz en móvil vertical: el mástil solo enseña 3–4 trastes y hay que desplazarlo (aviso de girar el móvil).
      Valorar un mástil compacto para el quiz.
- [ ] Rutina: el temporizador de cada bloque arranca en pausa; valorar que siga solo al pasar de bloque.
- [ ] Rutina: solo usa ejercicios ya practicados; valorar sugerir la siguiente lección pendiente como bloque.
- [ ] Quiz: más tipos (intervalos, octavas, notas por encima del traste 12).

## Fase 3: hecha

- [x] Progreso en IndexedDB, completar lección con intentos, retomar, exportar/importar, `persist()`.
- [x] Ajustes y metrónomo recordados. PWA offline (e2e en modo avión) y Lighthouse ≥ 90.
- [x] GitHub Pages activado y publicado a mano (2026-10-04). Opcional: variable `PAGES_ENABLED=true` para publicar en
      cada push.
- [x] Versión publicada en el móvil: modo sin conexión probado y funciona (2026-10-06).
- [ ] Probar la app instalada en el móvil, solo iOS si tienes iPhone (añadir a pantalla de inicio; comprobar que el progreso se conserva).
- [ ] Avisos de build de alphaTab (`import.meta` en formato iife de sus workers): funcionan, pero vigilar al actualizar.

## Fase 2: entregables

- [x] Esquema Zod del contenido + `npm run content:check` (rompe el build si hay errores).
- [x] Cargador (`virtual:course`) + render MDX con `<Exercise/>`, `<Fretboard/>`, `<Tab/>`, `<Metronome/>`;
      props validadas en `content:check`. Bundle principal: 1,61 MB → 285 KB.
- [x] Modo "siguiendo la clase": un paso por pantalla, paso en la URL, Anterior/Siguiente de 56 px, teclado y
      pedal, foco accesible, Wake Lock.
- [x] Método documentado (pedagogy.md), itinerarios en el esquema y `<Video>`.
- [x] Módulos 0–1 en borrador (6 lecciones, 6 ejercicios).
- [ ] **Tú**: probar los módulos 0–1 como alumno (¿se entiende?, ¿se puede tocar?, ¿el vídeo encaja con el texto?)
      y marcar `revisada` lo que esté bien. Anota lo que no.
- [x] Módulos 2–3 en borrador (mano izquierda: posición y presión, cromático, coordinación y apagado; ritmo I:
      pulso y contar, corcheas y silencios, cómo practicar), 7 ejercicios nuevos. Escritos antes de la revisión de 0–1.
- [x] Módulos 4–5 en borrador (tablatura, notas en E y A, octava; fundamental, quinta, 1-5-8 sobre I–IV–V).
      **Tronco común completo** (6 módulos, 18 lecciones, 20 ejercicios).
- [ ] Itinerarios: definir temario de cada estilo (rock/pop, funk/soul, blues/jazz). Metal/punk: hecho (pedagogy.md).
- [x] Metal/punk, módulo 1 · Púa (3 lecciones, 4 ejercicios) en borrador.
- [x] Metal/punk, módulo 2 · Galope y semicorcheas (3 lecciones, 4 ejercicios) en borrador.
- [x] Metal/punk, módulo 3 · Riffs graves en drop D (3 lecciones, 4 ejercicios) en borrador.
- [x] Metal/punk, módulo 4 · Tocar con la banda (3 lecciones, 5 ejercicios con batería). **Itinerario completo.**
- [ ] Revisar de oído la mezcla de batería/guitarra/bajo del soundfont (volúmenes por pista; hoy no se ajustan).
- [x] Opción de silenciar el bajo en la reproducción (tocar tú la parte del bajo con la banda).
- [ ] Drop D: buscar un vídeo de una fuente reconocida.
- [ ] Galope: buscar un vídeo de técnica (no de una canción) de una fuente reconocida.
- [ ] Ejercicios de metal/punk con dedos: hoy solo hay notación de púa (⊓/V); valorar indicar la alternativa.
- [ ] **Tú**: probar el itinerario metal/punk; confirmar púa por defecto y el foco (metal, punk o ambos).
- [ ] Palm mute: buscar un vídeo con púa de una fuente reconocida (el enlazado puede ser con pulgar).
- [ ] Comprobar de oído si alphaTab reproduce distinto las notas con palm mute (`{pm}`); no verificado.
- [ ] Publicar la web para compartirla (Fase 3: PWA + hosting). Revisar identidad visual (research.md §6) antes.

## Lecciones: mejoras anotadas

- [ ] **Wake Lock en tu móvil**: en el navegador integrado de desarrollo se deniega; comprobar en Chrome Android y
      Safari iOS (también instalada como app). **[Hipótesis: debería funcionar en ambos; verificar]**
- [x] En el paso 1 del móvil, la cabecera ocupaba casi toda la pantalla: los objetivos van plegados (Fase 6).
- [ ] Al recargar, el navegador restaura el scroll antiguo en vez de empezar arriba del paso.
- [x] Recordar el modo (paso a paso / completa) entre sesiones.

- [ ] "Practicar con escalera" desde la tarjeta de ejercicio (usar su `tempo.start/target/step` en la escalera).
- [x] Guardar la autoevaluación y el tempo limpio (intentos en IndexedDB).
- [x] Acceso a los ajustes desde cualquier vista (botón Ajustes de la cabecera, Fase 6).
- [x] Indicador en la cabecera de que el metrónomo suena: piloto con el pulso y BPM (Fase 6).
- [ ] Vite avisa de que la carga "nativa" de la config (futuro por defecto) exigirá extensiones en los imports de
      `vite.config` → `scripts/` → `src/`. Hoy es solo un aviso.

## Fase 1: entregables

- [x] Mástil SVG (4/5/6 cuerdas, afinaciones alternativas, zurdo, etiquetas nota/grado/intervalo, 12–24 trastes, sonido al pulsar).
- [x] Metrónomo completo: tap tempo, acentos configurables (acento/normal/silencio por pulso), escalera de tempo
      (cada N compases o al marcar un pase), pulso visual grande, ±1/±5, deslizador y volumen.
- [x] Diccionario de teoría: escalas y arpegios con fórmula, notas, pasos/intervalos, uso en el bajo, audio y mástil.
- [ ] **Revisar tú los textos del diccionario** (`summary`/`usage` en `src/theory/catalog.ts`): los redactó Claude.

## Metrónomo: mejoras anotadas

- [ ] "Gap click": N compases con clic y M en silencio (entrenar el pulso interno). Los acentos "silencio" ya cubren parte.
- [ ] Cambiar compás/subdivisión en marcha reinicia el contador de compases (y el de la escalera por compases).
- [x] Recordar la configuración del metrónomo y los ajustes globales entre sesiones (localStorage).
- [ ] Tap tempo: hoy es la media de los últimos 6 toques; si en el móvil resulta inestable, pasar a mediana.
- [ ] La escalera solo sube; no hay modo "bajar" ni "sube-baja".

## Diccionario y navegación: mejoras anotadas

- [ ] Resaltar en el mástil la nota que suena al pulsar "Escuchar".
- [ ] Más entradas: modos restantes (frigia, lidia, locria), menor melódica, acordes 6, sus2/sus4, 9.
- [x] Indicador en la cabecera de que el metrónomo está sonando (con BPM): piloto (Fase 6).
- [ ] Enlazar desde el diccionario al explorador del mástil con la misma selección.

## Mástil: mejoras anotadas

- [ ] Marcadores (puntos) de los trastes 7 y 12 quedan en parte tapados por notas en algunas vistas. Estético.
- [ ] Móvil en vertical: solo se ven ~3–4 trastes (el resto, con scroll dentro de la caja). Valorar un zoom o
      recomendar horizontal (modo atril, Fase 6).
- [ ] Rango de trastes con inicio ≠ 0 (el componente lo soporta; el explorador solo ofrece 0–N).
- [ ] Navegación por teclado: hoy solo con Tab por las notas visibles; las flechas entre casillas serían más cómodas.
- [ ] Sonido de nota sintético (sierra filtrada). Valorar samples propios en la Fase 5.
- [ ] Tonal 6.5.0 está mal empaquetado (`main`/`types` apuntan a ficheros que no existen). Fijado en 6.4.3;
      revisar cuando salga una 6.5.x corregida.

## Bugs y riesgos conocidos

- [ ] **alphaTab en móvil (375 px):** en las lecciones ya se maqueta a un compás por línea y cabe; comprobar en un
      móvil real y en horizontal.
- [ ] alphaTex: en alguna combinación mínima (p. ej. `\track "Bajo"` sin propiedades) el parser rechaza
      `\staff { score tabs }`. `content:check` lo detecta; si molesta, investigar la sintaxis exacta de alphaTab 1.8.
- [x] **Soundfont ausente en `dist/` / servidor caído al reiniciar**: causa probable encontrada. `alphatab-vite`
      copiaba fuentes y soundfont en cada arranque y en Windows fallaba con EBUSY si el fichero estaba abierto.
      Sustituido por `scripts/vite-plugin-alphatab-assets.ts` (copia solo si falta o cambia). CI lo sigue comprobando.
- [ ] Metrónomo en pestaña en segundo plano: los navegadores ralentizan `setInterval` a ~1 s y habría huecos.
      Opción: mover el temporizador a un Web Worker.
- [ ] `TabView`: el bucle no se vuelve a aplicar si la instancia de alphaTab se recrea (al cambiar `tex`). La velocidad sí.

## Fases siguientes (no entran en el primer hito)

- Fase 2: esquema Zod + MDX, `npm run content:check`, modo "siguiendo la clase" y módulos 0–3.
  **Las 3 primeras lecciones, escritas a mano por ti** como patrón de calidad.
- Fase 3: Zustand + Dexie, `persist()`, service worker, manifest, iconos, exportar/importar el progreso en JSON.
- Fase 4: Leitner, rutinas de 15/30/45 min, quiz de mástil.
- Fase 5: backing tracks, oído, afinador experimental (YIN/MPM, ventana ≥ 4096), tono de referencia y grabarse.
- Fase 6: tema "cabezal" completo y modo atril.
- Fase 7: módulos 4–12.

## Decisiones abiertas (tuyas)

(La 2, paleta, la tomó Claude en la Fase 6 a falta de tu revisión.)

1. ~~¿Currículo propio o compañero de un método existente?~~ → Propio, con vídeos enlazados (pedagogy.md).
2. Paleta: crema/negro, verde quirófano, burdeos, o naranja solo como acento. (Provisional: oscuro + ámbar.)
3. ~~¿Se publicará?~~ → Sí, para amigos bajistas (sin backend por ahora).
4. ¿Grabas tú los audios de demostración o solo síntesis?
5. ~~Nombre definitivo de la app~~ → Basscraft (2026-10-06).

## Legal y publicación (auditoría 2026-10-07)

- [x] Contacto: incidencias de GitHub (`src/legal.ts`); cambiar si prefieres un correo o formulario (2026-10-07).
- [ ] **Verificar el soundfont `sonivox.sf2`** (origen y licencia de la conversión; la página de musical-artifacts dio 403): ver
      `docs/legal-licenses.md`, duda nº 1.
- [ ] **Revisión del autor** de lecciones y ejercicios y rellenar la columna «revisado por el autor» de `docs/legal-provenance.md`
      (empezar por `riff-tritono`: compararlo de oído con el riff de Black Sabbath que cita la lección).
- [ ] Muestrear 5–10 lecciones buscando frases en un buscador (paráfrasis demasiado cercana a las fuentes de `pedagogy.md`).
- [ ] Comprobar a mano marca y dominios de «Basscraft» (TMview, OEPM, USPTO, Google Play, dominios; `basscraft.com` es una
      empresa de sonido): `docs/legal-naming.md`.
- [ ] Decidir si unificar el nombre (repo y URL `bass-tutor` → `basscraft`) y el término «profesor»/«guía».
- [ ] Decidir si se cambia el email de autor de git (los 49 commits llevan el email personal) y, si se activa
      `CONTENT-LICENSE.md`, aplicar la licencia.
- [ ] Comprobar el aviso de copyright de alphaTab en el chunk `TabView` minificado (`grep -l Kuschny dist/assets/*.js`).
- [ ] Comprobar que los 56 enlaces de vídeo siguen vivos (`docs/legal-provenance.md`).
- [ ] Consultar con un profesional de propiedad intelectual si se va a monetizar, publicar en tiendas o licenciar el contenido.
