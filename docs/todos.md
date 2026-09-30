# Pendientes

## Fase 0: lo que queda para cerrarla

- [ ] **Probar en tu móvil** (solo se puede hacer a mano): metrónomo y reproducción de alphaTab en Chrome Android
      y/o Safari iOS. Hace falta servir en red local (`npm run dev -- --host`) o desplegar.
- [ ] Si tienes iPhone: comprobar el modo standalone (UE, iOS ≥ 17.4), `getUserMedia` y la persistencia del almacenamiento.
- [ ] iOS: comprobar si el interruptor de silencio corta el audio de Web Audio y documentarlo. **[Hipótesis]**
- [ ] Ver el primer run de CI en GitHub Actions en verde.

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
- [ ] Módulos 4–5 (ubicarse, primeras líneas; usar `fundamental-quinta` en el 5).
- [ ] Itinerarios: definir temario de cada estilo (rock/pop, funk/soul, blues/jazz, metal/punk).
- [ ] Publicar la web para compartirla (Fase 3: PWA + hosting). Revisar identidad visual (research.md §6) antes.

## Lecciones: mejoras anotadas

- [ ] **Wake Lock en tu móvil**: en el navegador integrado de desarrollo se deniega; comprobar en Chrome Android y
      Safari iOS (también instalada como app). **[Hipótesis: debería funcionar en ambos; verificar]**
- [ ] En el paso 1 del móvil, la cabecera (título, objetivos) ocupa casi toda la pantalla; valorar plegar los
      objetivos o moverlos al primer paso.
- [ ] Al recargar, el navegador restaura el scroll antiguo en vez de empezar arriba del paso.
- [ ] Recordar el modo (paso a paso / completa) entre sesiones → Fase 3.

- [ ] "Practicar con escalera" desde la tarjeta de ejercicio (usar su `tempo.start/target/step` en la escalera).
- [ ] Guardar la autoevaluación y el tempo limpio (Fase 3; hoy los checkboxes no se guardan).
- [ ] Acceso a los ajustes (afinación, zurdo, nombres) desde la lección; hoy solo desde Mástil/Diccionario.
- [ ] Indicador en la cabecera de que el metrónomo suena (útil ahora que se arranca desde las lecciones).
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
- [ ] Recordar la configuración (tempo, compás, acentos, escalera) y los ajustes globales entre sesiones → Fase 3
      (el store de Zustand ya existe; falta persistirlo en IndexedDB).
- [ ] Tap tempo: hoy es la media de los últimos 6 toques; si en el móvil resulta inestable, pasar a mediana.
- [ ] La escalera solo sube; no hay modo "bajar" ni "sube-baja".

## Diccionario y navegación: mejoras anotadas

- [ ] Resaltar en el mástil la nota que suena al pulsar "Escuchar".
- [ ] Más entradas: modos restantes (frigia, lidia, locria), menor melódica, acordes 6, sus2/sus4, 9.
- [ ] Indicador en la cabecera de que el metrónomo está sonando (con BPM) cuando estás en otra vista.
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

- [ ] **alphaTab en móvil (375 px):** la partitura se maqueta más ancha que la pantalla y se ve recortada
      (con scroll horizontal dentro de su caja). Revisar `display.layoutMode`/`scale` o un re-render al cambiar el ancho.
- [ ] alphaTex: en alguna combinación mínima (p. ej. `\track "Bajo"` sin propiedades) el parser rechaza
      `\staff { score tabs }`. `content:check` lo detecta; si molesta, investigar la sintaxis exacta de alphaTab 1.8.
- [x] **Soundfont ausente en `dist/` / servidor caído al reiniciar**: causa probable encontrada. `alphatab-vite`
      copiaba fuentes y soundfont en cada arranque y en Windows fallaba con EBUSY si el fichero estaba abierto.
      Sustituido por `scripts/vite-plugin-alphatab-assets.ts` (copia solo si falta o cambia). CI lo sigue comprobando.
- [ ] Metrónomo en pestaña en segundo plano: los navegadores ralentizan `setInterval` a ~1 s y habría huecos.
      Opción: mover el temporizador a un Web Worker.
- [ ] `TabPoc`: velocidad y bucle no se vuelven a aplicar si la instancia de alphaTab se recrea (p. ej., al cambiar `tex`).

## Fases siguientes (no entran en el primer hito)

- Fase 2: esquema Zod + MDX, `npm run content:check`, modo "siguiendo la clase" y módulos 0–3.
  **Las 3 primeras lecciones, escritas a mano por ti** como patrón de calidad.
- Fase 3: Zustand + Dexie, `persist()`, service worker, manifest, iconos, exportar/importar el progreso en JSON.
- Fase 4: Leitner, rutinas de 15/30/45 min, quiz de mástil.
- Fase 5: backing tracks, oído, afinador experimental (YIN/MPM, ventana ≥ 4096), tono de referencia y grabarse.
- Fase 6: tema "cabezal" completo y modo atril.
- Fase 7: módulos 4–12.

## Decisiones abiertas (tuyas)

1. ~~¿Currículo propio o compañero de un método existente?~~ → Propio, con vídeos enlazados (pedagogy.md).
2. Paleta: crema/negro, verde quirófano, burdeos, o naranja solo como acento. (Provisional: oscuro + ámbar.)
3. ~~¿Se publicará?~~ → Sí, para amigos bajistas (sin backend por ahora).
4. ¿Grabas tú los audios de demostración o solo síntesis?
5. Nombre definitivo de la app (en research.md aparece "Bajo·Lab" como borrador).
