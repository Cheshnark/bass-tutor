# Especificación (resumen)

Resumen operativo de [research.md](research.md). Si hay conflicto, manda este archivo y
[decisions.md](decisions.md), que recogen las decisiones ya tomadas.

## Producto

Guía de práctica de bajo eléctrico en español, offline y sin backend. Cada lección sigue este esquema:
**explicación breve → demostración (audio/diagrama) → ejercicio con metrónomo y tempo objetivo →
autoevaluación (¿limpio, a tiempo, sin tensión?) → programación del repaso.**
No se puede marcar una lección como completada sin registrar un intento con tempo.

## Funciones del MVP (Fases 1–3)

1. Motor de lecciones (MDX + componentes incrustados, modo "siguiendo la clase", Wake Lock si está disponible).
2. Mástil SVG: escalas, arpegios, intervalos y notas; 4/5/6 cuerdas; afinaciones alternativas; zurdo;
   etiquetas por nota, grado o intervalo; 12–24 trastes; sonido al pulsar.
3. Metrónomo: BPM, compases, subdivisiones, acentos, tap tempo, escalera de tempo, pulso visual grande.
4. Visor de tab/partitura con reproducción, bucle A-B y control de tempo (alphaTab).
5. Ejercicios con criterio de superación (tempo objetivo + autoevaluación).
6. Progreso local: lecciones completadas, tempo limpio máximo por ejercicio, registro de sesiones.
7. PWA offline con todo el curso cacheado.
8. Diccionario de teoría (Tonal.js) mostrado en el mástil.

## Modelo de contenido

Ver [research.md §7](research.md). Resumen: `Module` → `Lesson` (con `steps` tipados) → `Exercise`
(alphaTex + `tempo {start, target, step}` + `passCriteria`). Estado de usuario en IndexedDB:
`ExerciseProgress` (con caja Leitner) y `Settings` (afinación, zurdo, nomenclatura, tema).

## Currículo

13 módulos (0 Arranque → 12 Técnicas extra), ver [research.md §2](research.md). El MVP incluye los módulos 0–3.

## Identidad visual

"Cabezal de ampli" genérico **sin combinar** los rasgos de Orange (naranja dominante + marco "picture frame"
+ pictogramas + rotulación redondeada + escudo). Skeuomorfismo solo en el marco; contenido plano y legible.
Paleta: **crema y negro con acento ámbar** (tolex negro, placa crema, pilotos ámbar) y tema de alto contraste.
Rótulos en Oswald (condensada), texto en la sans del sistema. Ver [decisions.md](decisions.md) y [accesibilidad.md](accesibilidad.md).

## Restricciones

- Nada de tablaturas, letras ni audio de canciones con copyright. Solo ejercicios originales o de dominio público.
- Controles principales ≥ 48 px; contraste WCAG AA; pulso del metrónomo también en visual.
