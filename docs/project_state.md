# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 2 (motor de lecciones). Motor terminado; contenido en marcha

### Cambio de planteamiento (2026-09-30)

El autor toca pero no es profesor, y quiere compartir el curso con amigos bajistas. Por eso:
- El contenido lo redacta Claude siguiendo un **método documentado** ([pedagogy.md](pedagogy.md)): consenso de
  varios métodos reconocidos, fuentes por cada decisión técnica y **vídeos gratuitos enlazados** para ver cada gesto.
- Estructura: **tronco común** (módulos 0–5) y después **itinerarios por estilo** (rock/pop, funk/soul/Motown,
  blues/jazz, metal/punk).

### Hecho en la Fase 2

1. Esquema del contenido + `content:check` (errores con línea, alphaTex validado).
2. Cargador y render MDX (`virtual:course`), componentes `<Exercise/>`, `<Fretboard/>`, `<Tab/>`, `<Metronome/>`.
3. Modo "siguiendo la clase" (un paso por pantalla, pedal, Wake Lock).
4. **Método e itinerarios**: `track` en los módulos, índice con tronco común + itinerarios ("En preparación"),
   componente `<Video>` (enlace verificado), y "Elige tu itinerario" al acabar el tronco común.
5. **Contenido en borrador**: módulo 0 (Arranque: equipo y afinación · postura y salud · cuerdas al aire) y
   módulo 1 (Mano derecha: pulsación alterna · cambios de cuerda · apagado), con 6 ejercicios originales y 9 vídeos.
- Tests: 111 unitarios y 64 e2e.

### Pendiente de ti

- **Probar los módulos 0–1 como alumno**: ¿se entiende?, ¿se puede tocar?, ¿el vídeo muestra lo mismo que el texto?
  Marca `status: revisada` lo que esté bien y cuéntame lo que no. (No he visto los vídeos: solo verifiqué que existen,
  su título y su canal.)
- Probar en tu móvil y confirmar el CI.

## Siguiente paso

Con tu revisión de 0–1: **módulos 2–3** (mano izquierda con 1-2-4 en trastes bajos; ritmo I) en borrador, con el
mismo método. Después, 4–5 y el temario de los itinerarios.
