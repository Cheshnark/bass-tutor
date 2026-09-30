---
paths:
  - "src/content/**"
---

# Reglas de contenido

Guía completa: `docs/content-guide.md`. Esquema: `src/content/schema.ts`.

- Tras tocar cualquier fichero de `src/content/`, ejecuta `npm run content:check` (tiene que salir sin errores).
- Ids = nombres de fichero/carpeta en kebab-case; no los escribas dentro de los ficheros.
- Módulos en `modules/NN-<id>/` con `module.yaml` (orden de lecciones); lecciones `.mdx` con frontmatter;
  cada `## Título` del cuerpo es un paso. Ejercicios en `exercises/<id>.yaml` con el alphaTex en un bloque `|`.
- Afinación de bajo en alphaTex: `\tuning (G2 D2 A1 E1)` (de aguda a grave). Usa `\staff { score tabs }` y `\clef bass`.
- Solo material original o de dominio público. Pon `\subtitle "Ejercicio original · Bass Tutor"`.
- Todo lo que generes va con `status: borrador`. Solo el autor lo pasa a `revisada` después de tocarlo.
- Componentes en el MDX: solo `<Exercise id>`, `<Fretboard …>`, `<Tab exercise>`, `<Metronome bpm>` con props literales.
  Incrusta cada ejercicio de la lección con `<Exercise id="…" />` en el paso "Ejercicio".
- Plantilla de lección: objetivo → por qué importa → cómo se hace → ejercicio → errores comunes → autoevaluación.
