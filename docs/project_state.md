# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 2 (motor de lecciones). Entregable 1 hecho: esquema del contenido

### Hecho en la Fase 2

- **Esquema Zod** (`src/content/schema.ts`) para módulos (`module.yaml`), lecciones (frontmatter del `.mdx`),
  ejercicios (`exercises/<id>.yaml` con el alphaTex dentro) y las props de `<Fretboard/>` incrustado.
  Mensajes de error en español.
- **`npm run content:check`**: valida cada fichero, las referencias cruzadas (lecciones ↔ módulos, ejercicios,
  prerrequisitos, ids únicos) y **parsea el alphaTex con alphaTab** (errores con línea y columna, y comprueba que
  el compás declarado coincide). Se ejecuta antes de cada build: **si el contenido no cumple el esquema, el build falla**
  (criterio de aceptación de la Fase 2).
- **Guía de contenido**: [content-guide.md](content-guide.md).
- **Contenido de ejemplo** en borrador: módulo `00-arranque` con la lección `cuerdas-al-aire` y el ejercicio
  `cuerdas-al-aire-negras`. El ejercicio de la PoC de tablatura pasó a `exercises/fundamental-quinta.yaml` y la
  vista Tablatura ya lo carga validado por el esquema.
- Tests: 98 unitarios (14 nuevos de validación) y 40 e2e.

### Hecho en la Fase 1 (cerrada)

Mástil SVG, metrónomo completo, diccionario de teoría, navegación por pestañas y ajustes globales. Ver [roadmap.md](roadmap.md).

### Pendiente de ti

- **Escribir las 3 primeras lecciones** siguiendo [content-guide.md](content-guide.md) (o reescribir la de ejemplo).
- Revisar los textos del diccionario (`src/theory/catalog.ts`).
- Probar en tu móvil real y confirmar el CI.

## Siguiente paso inmediato

Fase 2, entregable **"cargador + render MDX"**: cargar el contenido en la app (idealmente precompilado a JSON en
el build), renderizar las lecciones MDX con `<Fretboard/>`, `<Tab/>` y `<Metronome/>` incrustados, y validar las
props de esos componentes en `content:check`. Después, el modo "siguiendo la clase".
