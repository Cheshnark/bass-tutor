# Estado del proyecto

_Última actualización: 2026-10-01_

## Fases 0–3 cerradas; contenido: tronco común completo y módulos 1–3 de metal/punk (borrador)

### Fase 3 (progreso + PWA): hecha

- **Progreso** en el dispositivo (IndexedDB): intentos por ejercicio (tempo y pase limpio), mejor tempo limpio,
  tempo sugerido para el siguiente intento, lecciones completadas (exige un intento de cada ejercicio) y "Sigue en
  el paso N" en el índice. **Copia exportable/importable** (JSON).
- **Ajustes y metrónomo** se recuerdan al volver.
- **Sin conexión**: tras la primera visita funciona todo el curso, partitura y sonido incluidos (e2e en modo avión,
  también bajo `/bass-tutor/`). Instalable como app (manifest + iconos propios). Aviso de versión nueva.
- **Lighthouse (móvil)**: 98/100/100 portada, 97/100/100 lección (rendimiento/accesibilidad/buenas prácticas).
- **Publicación** en GitHub Pages preparada (`.github/workflows/deploy.yml`); falta que la actives tú.
- Tests: 132 unitarios y 82 e2e.

### Contenido

Tronco común: 6 módulos, 18 lecciones, 20 ejercicios, todo en borrador (ver [pedagogy.md](pedagogy.md)).

**Itinerario metal/punk** (borrador): temario de 4 módulos en [pedagogy.md](pedagogy.md). Escritos:
- **Módulo 1 · Púa**: coger la púa y tocar hacia abajo, púa alterna y cambios de cuerda, palm mute y la corchea punk
  (3 lecciones, 4 ejercicios con notación de púa ⊓/V y P.M.).
- **Módulo 2 · Galope y semicorcheas**: semicorcheas con púa alterna, el galope y el galope inverso (con golpe al
  aire), resistencia sin tensión (3 lecciones, 4 ejercicios).
- **Módulo 3 · Riffs graves** (todo en drop D): afinar en drop D y nota pedal, fundamental-quinta-octava en el
  mismo traste, frigio (♭2) y tritono (3 lecciones, 4 ejercicios). Los mástiles de lección pueden fijar su
  afinación (`<Fretboard tuning="drop-d-4">`).

Fuentes y vídeos verificados en pedagogy.md.
En el índice, los módulos de un itinerario se numeran 1, 2, 3… (las carpetas usan bloques: metal/punk = 40–49).

### Pendiente de ti

- **Activar GitHub Pages** (Settings → Pages → Source: GitHub Actions) y lanzar el workflow "Publicar en GitHub Pages".
- Probar el tronco común como alumno y en tu móvil (instalada como app).
- Probar los módulos 1–3 de metal/punk y decir si prefieres púa o dedos, y metal o punk como foco (se eligió púa y una
  mezcla de ambos sin poder preguntarte).

## Siguiente paso

Itinerario **metal/punk, módulo 4** (tocar con la banda: doblar el riff o sostener la fundamental, punk rápido,
5 cuerdas opcional), salvo que al probar los módulos 1–3 cambies el enfoque.
