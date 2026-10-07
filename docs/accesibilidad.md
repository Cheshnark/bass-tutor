# Accesibilidad (WCAG 2.2 AA)

Criterio de la Fase 6 ([roadmap.md](roadmap.md)): WCAG 2.2 AA; objetivos táctiles ≥ 24 px y ≥ 48 px en los
controles principales.

## Lo que se comprueba solo (en cada `npm run test:e2e`)

- **axe-core** (`e2e/a11y.spec.ts`), reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`, en las 11 vistas
  (índice, lección paso a paso, lección completa, práctica, quiz, oído, mástil, diccionario, metrónomo, afinador y
  ajustes), con los **dos temas** (cabezal y alto contraste), en escritorio y móvil, y la lección en modo atril.
  Cero infracciones. Para que el cero no sea un falso negativo, el test exige que las reglas de contraste
  (`color-contrast`) y de tamaño de objetivo (`target-size`, 2.5.8) se hayan evaluado y pasen.
  Se excluye el interior del SVG de alphaTab (librería de terceros); su contenedor sí se audita.
- **Controles principales ≥ 48 × 48 px** (`e2e/design.spec.ts`): pestañas, Ajustes, botones de la lección
  (completa/paso a paso, atril, Siguiente), metrónomo de la lección, Guardar intento, Reproducir, Iniciar metrónomo,
  Activar micrófono, cuerdas del afinador, respuestas del quiz y modo atril.
- Tema automático: sigue `prefers-contrast: more` del sistema.
- **Medidas objetivas de criterios que axe no decide** (`e2e/wcag-manual.spec.ts`, 8 vistas, Chromium):
  - **1.4.10 Reflow**: a 320 px el documento no es más ancho que la ventana (el mástil, la partitura y las pestañas
    se desplazan dentro de su caja).
  - **1.4.12 Espaciado de texto**: con los valores del criterio (interlineado 1,5, letras 0,12 em, palabras 0,16 em,
    párrafos 2 em) ningún elemento que recorta su contenido deja texto fuera.
  - **2.4.11 Foco no oculto**: tabulando por la vista, ningún control enfocado queda tapado por otro elemento (la barra
    fija de la lección reserva su alto con `scroll-padding-bottom`).

## Lo que hay que revisar a mano (axe no lo puede decidir)

| Criterio | Cómo comprobarlo | Estado |
|---|---|---|
| 1.3.2 Orden con sentido / 2.4.3 Orden del foco | Recorrer cada vista solo con Tab | **Sin revisar**: falta pasada a mano |
| 1.4.10 Reflow (320 px) | Zoom al 400 % o ventana de 320 px: sin scroll horizontal de página | Automatizado (arriba). Corregido el 2026-10-07: la cabecera desbordaba hasta 349 px en todas las vistas. Falta ver cómo queda a mano |
| 1.4.12 Espaciado de texto | Bookmarklet de espaciado: no se corta texto | Automatizado (arriba); sin infracciones |
| 2.3.1 Tres destellos | El piloto destella con el pulso: hasta 5 por segundo al máximo del metrónomo (300 BPM). Es un punto de 22 px; el criterio solo cuenta destellos de área mucho mayor (umbral general). Con `prefers-reduced-motion` no destella | Cumple por área **[Inferencia: no medido con herramienta]** |
| 2.4.11 Foco no tapado | La barra fija de Anterior/Siguiente no debe tapar el elemento con foco | Automatizado (arriba). Corregido el 2026-10-07: en la lección el foco de la autoevaluación y de "Guardar intento" quedaba bajo la barra |
| 4.1.3 Mensajes de estado | Afinador (`role=status`), feedback del quiz y "Paso N de M" con `aria-live` | Revisado en el código |
| Lector de pantalla | VoiceOver (iOS) o TalkBack (Android) en una lección y en el quiz | Pendiente (del autor) |

## Decisiones que afectan a la accesibilidad

- Alto contraste: negro, blanco y amarillo, bordes de 2 px, sin texturas; disponible siempre en Ajustes.
- La decoración (rejilla, tolex, piloto apagado) es `aria-hidden` y nunca va detrás de texto.
- En el quiz, el nombre accesible de la casilla preguntada no dice la nota (no se revela la respuesta).
- En el modo atril, "Paso N de M" se oculta solo a la vista: los lectores de pantalla lo siguen anunciando.
