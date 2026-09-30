# Pendientes

## Fase 0: lo que queda para cerrarla

- [ ] **Probar en tu móvil** (solo se puede hacer a mano): metrónomo y reproducción de alphaTab en Chrome Android
      y/o Safari iOS. Hace falta servir en red local (`npm run dev -- --host`) o desplegar.
- [ ] Si tienes iPhone: comprobar el modo standalone (UE, iOS ≥ 17.4), `getUserMedia` y la persistencia del almacenamiento.
- [ ] iOS: comprobar si el interruptor de silencio corta el audio de Web Audio y documentarlo. **[Hipótesis]**
- [ ] Ver el primer run de CI en GitHub Actions en verde.

## Fase 2: entregables

- [x] Esquema Zod del contenido + `npm run content:check` (rompe el build si hay errores).
- [ ] Cargador de contenido en la app + render MDX con `<Fretboard/>`, `<Tab/>`, `<Metronome/>` incrustados;
      validar las props de esos componentes en `content:check`.
      **Idea:** compilar/validar el contenido a JSON en build para no enviar Zod + yaml al navegador (el bundle
      subió de 1,37 a 1,61 MB al meterlos).
- [ ] Modo "siguiendo la clase" (un paso `##` por pantalla, texto grande, botón siguiente, Wake Lock).
- [ ] Módulos 0–3 (~10 lecciones). **Escribe tú las 3 primeras** (research.md §12). La lección y el ejercicio de
      ejemplo de `00-arranque` están en borrador: reescríbelos o márcalos como revisados tras tocarlos.

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
- [ ] **Bundle de 1,61 MB** (alphaTab + Zod + yaml en el chunk principal). Cargar el visor de tab con `import()` diferido
      y compilar el contenido a JSON en build.
- [ ] alphaTex: en alguna combinación mínima (p. ej. `\track "Bajo"` sin propiedades) el parser rechaza
      `\staff { score tabs }`. `content:check` lo detecta; si molesta, investigar la sintaxis exacta de alphaTab 1.8.
- [ ] **Soundfont ausente en `dist/`:** pasó una vez, en el primer build, y no se ha podido reproducir en builds limpios.
      CI lo comprueba (`test -s dist/soundfont/sonivox.sf2`). Si vuelve a pasar, investigar la carrera entre
      `copyAssetsPlugin` y la copia de `public/`.
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

1. ¿Currículo propio completo o compañero de un método existente? (Recomendado: híbrido, ~30 lecciones propias.)
2. Paleta: crema/negro, verde quirófano, burdeos, o naranja solo como acento. (Provisional: oscuro + ámbar.)
3. ¿Se publicará algún día? Afecta a la marca, las licencias y el backend.
4. ¿Grabas tú los audios de demostración o solo síntesis?
5. Nombre definitivo de la app (en research.md aparece "Bajo·Lab" como borrador).
