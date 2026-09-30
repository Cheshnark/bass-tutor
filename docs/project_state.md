# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 2 (motor de lecciones). Entregables 2 de 4 hechos

### Hecho en la Fase 2

1. **Esquema del contenido** + `npm run content:check` (ver [content-guide.md](content-guide.md)).
2. **Cargador y render MDX**:
   - La app arranca en **Curso**: índice de módulos y lecciones → página de lección (`#/curso/<id>`) con objetivos,
     pasos, componentes y navegación anterior/siguiente.
   - Componentes para las lecciones: `<Exercise/>` (tarjeta con instrucciones, tempo, metrónomo, partitura con
     reproducción y autoevaluación), `<Fretboard/>`, `<Tab/>` y `<Metronome/>`.
   - `content:check` y el build validan nombre, props (con Zod) y referencias de esos componentes, con la línea
     real del fichero en cada error.
   - El contenido llega a la app como JSON validado (`virtual:course`): Zod y yaml ya no van al navegador. alphaTab
     y cada lección se cargan bajo demanda. **Bundle principal: 1,61 MB → 285 KB.**
   - El metrónomo es un motor único: el de la lección y el del panel son el mismo.
- Tests: 105 unitarios y 44 e2e (escritorio + móvil).

### Pendiente de ti

- **Escribir las 3 primeras lecciones** con [content-guide.md](content-guide.md) (la de ejemplo sigue en borrador).
- Revisar los textos del diccionario (`src/theory/catalog.ts`).
- Probar en tu móvil real y confirmar el CI.

## Siguiente paso inmediato

Fase 2, entregable **"modo siguiendo la clase"**: un paso (`##`) por pantalla, texto grande, botón "Siguiente"
de ≥ 48 px, progreso de pasos y pantalla siempre encendida (Wake Lock, si el navegador lo permite).
Después: módulos 0–3 (~10 lecciones), que dependen de que escribas las primeras.
