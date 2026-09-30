# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 1 (herramientas núcleo). Entregables 2 de 3 hechos

### Hecho en la Fase 1

- **Mástil SVG** (`src/theory/` + `<Fretboard/>`): 4/5/6 cuerdas, afinaciones alternativas, zurdo (espejo exacto),
  etiquetas por nota/grado/intervalo, 0–12 a 0–24 trastes, sonido al pulsar y nomenclatura anglo/latina.
- **Metrónomo completo** (`src/audio/` + `MetronomePanel`):
  - Tap tempo, ±1/±5, deslizador y volumen.
  - Acentos por pulso (acento/normal/silencio) editables pulsando los pilotos.
  - Escalera de tempo: sube cada N compases (exacto en el primer tiempo) o al marcar un "pase limpio";
    muestra el progreso y avisa al llegar al objetivo.
  - Lectura grande del BPM, piloto que parpadea con el pulso, contador de compases, botones Tap/Iniciar de 64 px.
- Tests: 68 unitarios y 30 e2e (escritorio + móvil), estables en ejecuciones repetidas.
- Verificado en el navegador: escalera por compases subiendo en marcha (100 → 105 en el compás 2) y
  maquetación a 355 y 375 px sin scroll lateral.

### Criterios de aceptación de la Fase 1 (roadmap)

- ✅ Tests unitarios de notas por traste y afinación.
- ✅ La versión zurda es el espejo exacto.
- ✅ Metrónomo sin deriva en 10 min, también con cambios de tempo en el primer tiempo (tests del reloj).
- ⏳ Diccionario de escalas y arpegios: pendiente.

### Arrastrado de la Fase 0

- Probarlo en **tu móvil real** y confirmar el primer run de CI (ver [todos.md](todos.md)).
  Ahora tiene más sentido: en el móvil hay que probar el tap tempo y si el clic se oye bien.

## Siguiente paso inmediato

Fase 1, entregable **"diccionario de teoría"**: vista de escalas y arpegios con fórmula (grados), notas e
intervalos, mostrada en el mástil y reutilizando `src/theory/catalog.ts`. Con eso se cierra la Fase 1.
