# Pendientes

## Fase 0: lo que queda para cerrarla

- [ ] **Probar en tu móvil** (solo se puede hacer a mano): metrónomo y reproducción de alphaTab en Chrome Android
      y/o Safari iOS. Hace falta servir en red local (`npm run dev -- --host`) o desplegar.
- [ ] Si tienes iPhone: comprobar el modo standalone (UE, iOS ≥ 17.4), `getUserMedia` y la persistencia del almacenamiento.
- [ ] iOS: comprobar si el interruptor de silencio corta el audio de Web Audio y documentarlo. **[Hipótesis]**
- [ ] Ver el primer run de CI en GitHub Actions en verde.

## Bugs y riesgos conocidos

- [ ] **alphaTab en móvil (375 px):** la partitura se maqueta más ancha que la pantalla y se ve recortada
      (con scroll horizontal dentro de su caja). Revisar `display.layoutMode`/`scale` o un re-render al cambiar el ancho.
- [ ] **Bundle de 1,37 MB** (alphaTab dentro del chunk principal). Cargar el visor de tab con `import()` diferido.
- [ ] **Soundfont ausente en `dist/`:** pasó una vez, en el primer build, y no se ha podido reproducir en builds limpios.
      CI lo comprueba (`test -s dist/soundfont/sonivox.sf2`). Si vuelve a pasar, investigar la carrera entre
      `copyAssetsPlugin` y la copia de `public/`.
- [ ] Metrónomo en pestaña en segundo plano: los navegadores ralentizan `setInterval` a ~1 s y habría huecos.
      Opción: mover el temporizador a un Web Worker.
- [ ] `TabPoc`: velocidad y bucle no se vuelven a aplicar si la instancia de alphaTab se recrea (p. ej., al cambiar `tex`).
- [ ] Cambiar el compás o la subdivisión con el metrónomo en marcha reinicia el compás en el siguiente tick. Aceptable para la PoC.

## Fases siguientes (no entran en el primer hito)

- Fase 1: mástil SVG (4/5/6 cuerdas, zurdo, etiquetas nota/grado/intervalo), `src/theory/` con Tonal.js,
  tap tempo, escalera de tempo y diccionario de escalas y arpegios.
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
