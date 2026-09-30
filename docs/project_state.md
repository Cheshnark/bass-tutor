# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 2 (motor de lecciones). Entregables 3 de 4 hechos: solo falta el contenido

### Hecho en la Fase 2

1. **Esquema del contenido** + `npm run content:check` (ver [content-guide.md](content-guide.md)).
2. **Cargador y render MDX**: vista Curso, lecciones con `<Exercise/>`, `<Fretboard/>`, `<Tab/>`, `<Metronome/>`;
   contenido validado en build (`virtual:course`); bundle principal 285 KB.
3. **Modo "siguiendo la clase"** (por defecto):
   - Un paso (`##`) por pantalla con texto grande; "Paso N de M" y barra de progreso con enlace a cada paso.
   - Barra inferior fija con **Anterior / Siguiente** de 56 px; en el último paso, "Siguiente lección" o "Volver al curso".
   - **Teclas ←/→ y RePág/AvPág**, que es lo que envían los pedales de pasar página Bluetooth.
   - El paso va en la URL (`#/curso/<id>/3`): recargar lo mantiene y "atrás" vuelve al anterior.
   - **Pantalla siempre encendida** (Screen Wake Lock) mientras sigues la clase; si el navegador no lo permite, lo dice.
   - Botón para ver la lección completa y volver.
- Tests: 109 unitarios y 62 e2e (escritorio + móvil), estables en ejecuciones repetidas.

### Criterios de aceptación de la Fase 2 (roadmap)

- ✅ El build falla si el contenido no cumple el esquema.
- ✅ Cada lección tiene objetivos, ejercicio y criterio (lo exige el esquema).
- ⏳ "Se puede usar a un metro de distancia (revisión manual en móvil)": pendiente de que lo pruebes tú.
- ⏳ Módulos 0–3 completos (~10 lecciones): pendiente (contenido).

### Pendiente de ti

- **Escribir las 3 primeras lecciones** con [content-guide.md](content-guide.md). Es lo que desbloquea el resto de la Fase 2.
- **Probar en tu móvil**: modo paso a paso a un metro, Wake Lock, audio y tap tempo (`npm run dev -- --host`).
- Revisar los textos del diccionario (`src/theory/catalog.ts`) y confirmar el CI.

## Siguiente paso

El último entregable de la Fase 2 es **contenido** (módulos 0–3). Opciones:
- Escribes tú las 3 primeras lecciones y después Claude redacta borradores del resto con ese patrón.
- O se adelanta la **Fase 3** (progreso en IndexedDB + PWA offline) mientras escribes.
