---
paths:
  - "src/content/**"
---

# Reglas de contenido

- Ejercicios en alphaTex (`.atex`), importados con `?raw`. Afinación de bajo: `\tuning (G2 D2 A1 E1)`
  (de aguda a grave: la cuerda 1 es G y la 4 es E). Usa `\staff { score tabs }` y `\clef bass`.
- Solo material original o de dominio público. Pon `\subtitle "Ejercicio original · Bass Tutor"`.
- Plantilla de lección: objetivo → por qué importa → demostración → ejercicio (tempo inicial y objetivo) →
  errores comunes → autoevaluación → repaso.
- Todo ejercicio generado por Claude es un **borrador**: el autor lo toca y lo valida antes de darlo por bueno.
- (Fase 2) Toda lección cumple `src/content/schema.ts` y `npm run content:check` pasa.
