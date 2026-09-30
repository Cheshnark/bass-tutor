# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 1 (herramientas núcleo). Entregable 1 de 3 hecho: mástil SVG

### Hecho en la Fase 1

- **`src/theory/`** (Tonal.js 6.4.3): afinaciones de 4/5/6 cuerdas (estándar, drop D, medio tono abajo, Do agudo),
  nota por cuerda/traste, escalas, arpegios e intervalos con la ortografía correcta, grados (♭3, ♭7...),
  nomenclatura anglo/latina y un catálogo con nombres en español.
- **`<Fretboard/>`**: SVG con 4/5/6 cuerdas, zurdo (espejo exacto), etiquetas por nota/grado/intervalo,
  0–12 a 0–24 trastes, fundamental resaltada y sonido al pulsar cualquier casilla.
- **`FretboardExplorer`** en la página principal para probarlo todo.
- `AudioContext` compartido entre el metrónomo y el mástil.
- Tests: 52 unitarios (teoría, geometría, zurdo = espejo, reloj del metrónomo) y 18 e2e (escritorio + móvil).
- Verificado en el navegador: pentatónica menor de A, La m7 en 6 cuerdas zurdo con grados y nombres latinos,
  y sonido al pulsar. Sin errores en consola.

### Criterios de aceptación de la Fase 1 (roadmap)

- ✅ Tests unitarios de notas por traste y afinación.
- ✅ La versión zurda es el espejo exacto (test de geometría + e2e de la cejuela).
- ✅ Metrónomo sin deriva en 10 min (test del reloj, desde la Fase 0).
- ⏳ Metrónomo completo (tap tempo, escalera de tempo) y diccionario de teoría: pendientes.

### Arrastrado de la Fase 0

- Probarlo en **tu móvil real** y confirmar el primer run de CI (ver [todos.md](todos.md)).

## Siguiente paso inmediato

Fase 1, entregable **"metrónomo completo"**: tap tempo, acentos configurables, escalera de tempo
(subir X BPM cada N compases o tras marcar un pase) y pulso visual grande. Después, el diccionario de teoría.
