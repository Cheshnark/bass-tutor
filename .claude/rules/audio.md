---
paths:
  - "src/audio/**"
---

# Reglas de audio

- La lógica de tiempos va en módulos **puros** (como `beatClock.ts`) testeados con Vitest; la capa Web Audio,
  aparte (`metronome.ts`).
- Calcula los instantes como `origen + n * duración`; nunca acumules sumas (provoca deriva).
- Planificador: temporizador de ~25 ms que solo despierta; margen de programación de ~100 ms sobre `ctx.currentTime`.
- La UI visual se sincroniza leyendo `ctx.currentTime` en `requestAnimationFrame`, no con temporizadores propios.
- Todo nodo o contexto creado se libera (`stop`, `close`) al desmontar.
- Cualquier cambio en el metrónomo mantiene en verde el test "sin deriva en 10 minutos".
