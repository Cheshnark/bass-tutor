# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase 1 (herramientas núcleo): cerrada ✅

### Qué hay

- **Navegación** por pestañas: Mástil · Diccionario · Metrónomo · Tablatura. El metrónomo sigue sonando al cambiar de vista.
- **Ajustes globales** (Zustand, sin persistir aún): afinación de 4/5/6 cuerdas, zurdo y nomenclatura C-D-E / Do-Re-Mi,
  compartidos por el mástil y el diccionario.
- **Mástil SVG**: escalas, arpegios, intervalos y notas; etiquetas por nota/grado/intervalo; 0–12 a 0–24 trastes; sonido al pulsar.
- **Diccionario**: 9 escalas y 9 arpegios con fórmula en grados, notas (se pueden escuchar una a una), pasos T/S
  o intervalos entre notas, uso en el bajo, botón "Escuchar" (secuencia ascendente) y vista en el mástil.
- **Metrónomo completo**: tap tempo, acentos por pulso, escalera de tempo (por compases o por pase), pulso visual grande.
- **Tablatura** (PoC de la Fase 0): alphaTab con reproducción.
- Tests: 84 unitarios y 40 e2e (escritorio + móvil), estables en ejecuciones repetidas.

### Criterios de aceptación de la Fase 1 (roadmap)

- ✅ Tests unitarios de notas por traste y afinación.
- ✅ Metrónomo sin deriva en 10 min (también con cambios de tempo en el primer tiempo).
- ✅ La versión zurda es el espejo exacto.
- ✅ Diccionario de escalas y arpegios con Tonal.js.

### Pendiente de ti

- **Probar en tu móvil real**: audio, tap tempo, legibilidad a un metro (`npm run dev -- --host`).
- **Revisar los textos del diccionario** (`src/theory/catalog.ts`, campos `summary` y `usage`).
- Confirmar que el CI de GitHub Actions pasa.

## Siguiente paso: Fase 2 (motor de lecciones)

Antes de programar nada hace falta decidir el formato. Primer entregable propuesto: **esquema Zod del contenido**
(`Module`, `Lesson`, `Step`, `Exercise`, según research.md §7) + `npm run content:check` que haga fallar el build si
una lección no cumple el esquema. Después, MDX con `<Fretboard/>`, `<Metronome/>` y `<Tab/>` incrustados, y el modo
"siguiendo la clase". Recomendación de research.md: **escribe tú a mano las 3 primeras lecciones** como patrón de calidad.
