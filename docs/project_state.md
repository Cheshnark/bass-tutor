# Estado del proyecto

_Última actualización: 2026-09-30_

## Fase actual: 2 (motor de lecciones). Motor terminado; contenido del tronco común en marcha (4 de 6 módulos)

El autor toca pero no es profesor y quiere compartir el curso con amigos: el contenido lo redacta Claude siguiendo
el método documentado en [pedagogy.md](pedagogy.md) (fuentes contrastadas + vídeos enlazados verificados).

### Contenido (todo en borrador)

| Módulo | Lecciones | Ejercicios |
|---|---|---|
| 0 · Arranque | Equipo y afinación · Postura y salud · Cuerdas al aire | 3 |
| 1 · Mano derecha | Pulsación alterna · Cambios de cuerda · Apagado mano derecha | 3 |
| 2 · Mano izquierda | Posición y presión (1-2-4) · Cromático (1.ª y 5.ª posición) · Coordinación y apagado | 4 |
| 3 · Ritmo I | Pulso y contar · Corcheas y silencios · Cómo practicar (con "Tu primera línea") | 3 |

12 lecciones, 13 ejercicios en uso (+1 reservado para el módulo 5) y 13 vídeos verificados.

### Hecho en esta tanda (técnico)

- `remark-gfm`: las tablas de las lecciones se ven como tablas (y no desbordan en móvil).
- **Arreglo de fiabilidad**: el plugin de alphaTab tumbaba el servidor de dev al reiniciarlo en Windows (EBUSY al
  copiar el soundfont). Ahora la copia la hace `alphaTabAssets`, solo si falta o cambia.
- `content:check` detectó dos errores de YAML (una lista con ": " dentro); documentado en content-guide.md.
- Tests: 114 unitarios y 64 e2e.

### Pendiente de ti

- **Probar los módulos 0–3 como alumno** (los 2–3 se escribieron antes de tu revisión de 0–1): ¿se entiende?,
  ¿se puede tocar?, ¿el vídeo encaja? Marca `revisada` lo que esté bien y cuéntame lo que no.
- Probar en tu móvil y confirmar el CI.

## Siguiente paso

Módulos 4–5 del tronco común (tablatura, notas en E y A, octavas; fundamental, quinta y 1-5-8 sobre I–IV–V).
Con eso el tronco común estaría completo y tocaría el temario de los itinerarios.
